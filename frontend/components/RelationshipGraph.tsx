'use client'

import dynamic from 'next/dynamic'
import { forceCollide } from 'd3-force'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ForceGraphMethods, LinkObject, NodeObject } from 'react-force-graph-2d'
import { KINGDOMS } from '@/lib/constants'
import type { Kingdom } from '@/lib/types'
import { escapeHtml } from '@/lib/utils'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })


export interface GraphNode {
  id: number
  name: string
  scientific: string
  kingdom: Kingdom
  slug: string
  degree: number
  imageUrl?: string
}

export interface GraphLink {
  curvature: number
  label: string
  source: number | NodeObject<GraphNode>
  target: number | NodeObject<GraphNode>
}

interface Props {
  nodes: GraphNode[]
  links: GraphLink[]
}

// Base radius used by the force simulation (world-space, zoom-independent)
const BASE_RADIUS = (degree: number): number => Math.min(14, 3 + Math.sqrt(degree) * 4)
// Drawn radius: grows with zoom but at a dampened rate (square root of scale)
// so nodes get bigger when zoomed in, but not so big they overlap
const drawnRadius = (degree: number, globalScale: number): number => {
  const base = BASE_RADIUS(degree)
  // At scale 1: full base size. At scale 4: base * 2/4 = half. At scale 9: base * 3/9 = third.
  return base * Math.pow(globalScale, 0.65) / globalScale
}

export default function RelationshipGraph({ nodes, links }: Props): React.JSX.Element {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<ForceGraphMethods>(undefined)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map())
  const [width, setWidth] = useState(800)

  // Preload node images in batches to avoid hammering the proxy with 55 simultaneous requests
  useEffect(() => {
    const urls = nodes.map(n => n.imageUrl).filter((u): u is string => !!u && !imageCache.current.has(u))
    const BATCH = 6
    urls.forEach((url, i) => {
      setTimeout(() => {
        if (imageCache.current.has(url)) {
          return
        }
        const img = new Image()
        img.src = url
        imageCache.current.set(url, img)
      }, Math.floor(i / BATCH) * 300)
    })
  }, [nodes])

  useEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }
    const obs = new ResizeObserver(() => setWidth(el.clientWidth))
    obs.observe(el)
    setWidth(el.clientWidth)
    return () => obs.disconnect()
  }, [])


  const paintLink = useCallback((link: LinkObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (globalScale < 2.5) {
      return
    }
    const src = link.source as NodeObject<GraphNode> | undefined
    const tgt = link.target as NodeObject<GraphNode> | undefined
    if (src?.x == null || src.y == null || tgt?.x == null || tgt.y == null) {
      return
    }
    const midX = (src.x + tgt.x) / 2
    const midY = (src.y + tgt.y) / 2
    // Same screen-size cap as node labels: constant ~9px when zoomed in, shrinks when zoomed out
    const fontSize = Math.min(5, 9 / globalScale)
    ctx.save()
    ctx.font = `${fontSize}px "Miranda Sans", sans-serif`
    ctx.fillStyle = '#a8a29e'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((link as unknown as GraphLink).label, midX, midY)
    ctx.restore()
  }, [])

  const paintNode = useCallback((node: NodeObject<object>, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as NodeObject<GraphNode> & { x: number; y: number }
    const r = drawnRadius(n.degree, globalScale)
    ctx.beginPath()
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = KINGDOMS[n.kingdom].color
    ctx.fill()

    // Draw thumbnail image clipped to the circle when zoomed in enough
    if (n.imageUrl && r * globalScale >= 10) {
      const img = imageCache.current.get(n.imageUrl)
      if (img !== undefined && img.complete && img.naturalWidth > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI)
        ctx.clip()
        // Center-crop: use the largest centered square from the source
        const side = Math.min(img.naturalWidth, img.naturalHeight)
        const sx = (img.naturalWidth - side) / 2
        const sy = (img.naturalHeight - side) / 2
        ctx.drawImage(img, sx, sy, side, side, n.x - r, n.y - r, r * 2, r * 2)
        ctx.restore()
      }
    }

    // Labels: constant screen size via inverse zoom scaling
    if (globalScale >= 1.2 || n.degree >= 4) {
      const fontSize = Math.min(11, 14 / globalScale)
      ctx.font = `${fontSize}px "Miranda Sans", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      const labelY = n.y + r + 2 / globalScale
      const textWidth = ctx.measureText(n.name).width
      const padX = fontSize * 0.35
      const padY = fontSize * 0.2

      // Rounded rectangle background
      const rw = textWidth + padX * 2
      const rh = fontSize + padY * 2
      const rx = n.x - rw / 2
      const ry = labelY - padY
      const cr = fontSize * 0.25
      ctx.beginPath()
      ctx.roundRect(rx, ry, rw, rh, cr)
      ctx.fillStyle = 'rgba(250, 250, 249, 0.85)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(168, 162, 158, 0.4)'
      ctx.lineWidth = 0.5 / globalScale
      ctx.stroke()

      ctx.fillStyle = '#1c1917'
      ctx.fillText(n.name, n.x, labelY)
    }
  }, [])

  const paintNodeArea = useCallback((node: NodeObject<object>, color: string, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as NodeObject<GraphNode> & { x: number; y: number }
    const r = drawnRadius(n.degree, globalScale)
    ctx.beginPath()
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }, [])

  const adjacency = useMemo(() => {
    const map = new Map<number, Set<number>>()
    for (const l of links) {
      const src = typeof l.source === 'object' ? (l.source as NodeObject<GraphNode>).id : l.source as number
      const tgt = typeof l.target === 'object' ? (l.target as NodeObject<GraphNode>).id : l.target as number
      if (map.has(src) === false) {
        map.set(src, new Set())
      }
      if (map.has(tgt) === false) {
        map.set(tgt, new Set())
      }
      map.get(src)!.add(tgt)
      map.get(tgt)!.add(src)
    }
    return map
  }, [links])

  const lastClickRef = useRef<{ id: number; time: number } | null>(null)

  const handleClick = useCallback((node: NodeObject<object>) => {
    const n = node as NodeObject<GraphNode>
    const now = Date.now()
    const last = lastClickRef.current

    if (last && last.id === n.id && now - last.time < 350) {
      // Double-click: navigate
      lastClickRef.current = null
      const plural = n.kingdom === 'fungus' ? 'fungi' : `${n.kingdom}s`
      router.push(`/${plural}/${n.slug}`)
    } else {
      // Single click: zoom to fit the node and its direct neighbors
      lastClickRef.current = { id: n.id, time: now }
      const neighborIds = new Set<number>([n.id, ...(adjacency.get(n.id) ?? [])])
      graphRef.current?.zoomToFit(500, 120, (nd: NodeObject<object>) => neighborIds.has((nd as NodeObject<GraphNode>).id))
    }
  }, [router, adjacency])

  // Set forces on first mount, runs before most simulation ticks
  useEffect(() => {
    const fg = graphRef.current
    if (!fg) {
      return
    }
    fg.d3Force('charge')?.strength(-400).distanceMax(300)
    fg.d3Force('link')?.distance((link: LinkObject<object, object>) => {
      const srcDeg = typeof link.source === 'object' ? (link.source as NodeObject<GraphNode>).degree : 1
      const tgtDeg = typeof link.target === 'object' ? (link.target as NodeObject<GraphNode>).degree : 1
      return 80 + Math.max(srcDeg, tgtDeg) * 14
    })
    // Strengthen centering to prevent the cluster drifting bottom-heavy
    fg.d3Force('center')?.strength(1)
    // Collision force: prevents nodes from overlapping based on their actual drawn radius + label
    fg.d3Force('collide', forceCollide((node: NodeObject<object>) => {
      const n = node as NodeObject<GraphNode>
      return BASE_RADIUS(n.degree ?? 0) + 28
    }).strength(1).iterations(10))
  }, [])

  const hasInitialFit = useRef(false)
  const handleEngineStop = useCallback(() => {
    if (!hasInitialFit.current) {
      hasInitialFit.current = true
      setTimeout(() => graphRef.current?.zoomToFit(400, 48), 50)
    }
  }, [])

  // Imperative tooltip, avoids re-rendering the graph on every hover
  const handleNodeHover = useCallback((node: NodeObject<object> | null) => {
    const el = tooltipRef.current
    if (!el) {
      return
    }
    if (node) {
      const n = node as NodeObject<GraphNode>
      el.innerHTML = `
        <p class="text-sm font-semibold text-stone-900">${escapeHtml(n.name)}</p>
        <p class="text-xs italic text-stone-400">${escapeHtml(n.scientific)}</p>
        <p class="mt-0.5 text-xs capitalize text-stone-500">${escapeHtml(n.kingdom)}</p>
      `
      el.style.display = 'block'
    } else {
      el.style.display = 'none'
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: 600 }}>
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute left-4 top-4 z-10 hidden rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm"
      />
      <ForceGraph2D
        ref={graphRef}
        width={width}
        height={600}
        graphData={{ links, nodes }}
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={() => 'replace'}
        nodePointerAreaPaint={paintNodeArea}
        nodeLabel={() => ''}
        onNodeHover={handleNodeHover}
        onNodeClick={handleClick}
        linkLabel={() => ''}
        linkHoverPrecision={0}
        linkCanvasObjectMode={() => 'after'}
        linkCanvasObject={paintLink}
        linkColor={() => '#c7c3bf'}
        linkDirectionalArrowLength={2}
        linkDirectionalArrowRelPos={0.85}
        linkCurvature={(link: LinkObject) => (link as unknown as GraphLink).curvature}
        backgroundColor="#fafaf9"
        cooldownTicks={300}
        d3AlphaDecay={0.025}
        d3VelocityDecay={0.35}
        onEngineStop={handleEngineStop}
      />
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm">
        {(Object.entries(KINGDOMS) as [Kingdom, (typeof KINGDOMS)[Kingdom]][]).map(([k, cfg]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: cfg.color }} />
            <span className="text-xs capitalize text-stone-600">{k}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
