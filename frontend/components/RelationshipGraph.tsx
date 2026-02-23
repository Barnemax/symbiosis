'use client'

import dynamic from 'next/dynamic'
import { forceCollide } from 'd3-force'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ForceGraphMethods, LinkObject, NodeObject } from 'react-force-graph-2d'
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

const KINGDOM_COLOR: Record<Kingdom, string> = {
  bird: '#3b82f6',
  fungus: '#f97316',
  tree: '#22c55e',
}

const nodeRadius = (degree: number): number => Math.min(14, 3 + Math.sqrt(degree) * 4)

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
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = '#a8a29e'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((link as unknown as GraphLink).label, midX, midY)
    ctx.restore()
  }, [])

  const paintNode = useCallback((node: NodeObject<object>, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as NodeObject<GraphNode> & { x: number; y: number }
    const r = nodeRadius(n.degree)
    ctx.beginPath()
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = KINGDOM_COLOR[n.kingdom]
    ctx.fill()

    // Draw thumbnail image clipped to the circle when zoomed in enough
    if (n.imageUrl && r * globalScale >= 10) {
      const img = imageCache.current.get(n.imageUrl)
      if (img?.complete && img.naturalWidth > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(img, n.x - r, n.y - r, r * 2, r * 2)
        ctx.restore()
      }
    }

    // Labels are drawn in world space so they scale naturally with zoom.
    // Cap at 14px screen-equivalent to avoid enormous labels when very zoomed in.
    if (globalScale >= 1.2 || n.degree >= 4) {
      const fontSize = Math.min(11, 14 / globalScale)
      ctx.font = `${fontSize}px sans-serif`
      ctx.fillStyle = '#1c1917'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(n.name, n.x, n.y + r + 2)
    }
  }, [])

  const paintNodeArea = useCallback((node: NodeObject<object>, color: string, ctx: CanvasRenderingContext2D) => {
    const n = node as NodeObject<GraphNode> & { x: number; y: number }
    const r = nodeRadius(n.degree)
    ctx.beginPath()
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }, [])

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
      const neighborIds = new Set<number>([n.id])
      for (const l of links) {
        const src = typeof l.source === 'object' ? (l.source as NodeObject<GraphNode>).id : l.source as number
        const tgt = typeof l.target === 'object' ? (l.target as NodeObject<GraphNode>).id : l.target as number
        if (src === n.id) {
          neighborIds.add(tgt as number)
        }
        if (tgt === n.id) {
          neighborIds.add(src as number)
        }
      }
      graphRef.current?.zoomToFit(500, 120, (nd: NodeObject<object>) => neighborIds.has((nd as NodeObject<GraphNode>).id))
    }
  }, [router, links])

  // Set forces on first mount, runs before most simulation ticks
  useEffect(() => {
    const fg = graphRef.current
    if (!fg) {
      return
    }
    fg.d3Force('charge')?.strength(-180)
    fg.d3Force('link')?.distance((link: LinkObject<object, object>) => {
      const srcDeg = typeof link.source === 'object' && link.source ? (link.source as NodeObject<GraphNode>).degree ?? 1 : 1
      const tgtDeg = typeof link.target === 'object' && link.target ? (link.target as NodeObject<GraphNode>).degree ?? 1 : 1
      return 60 + Math.max(srcDeg, tgtDeg) * 9
    })
    // Strengthen centering to prevent the cluster drifting bottom-heavy
    fg.d3Force('center')?.strength(1)
    // Collision force: prevents nodes from overlapping based on their actual drawn radius
    fg.d3Force('collide', forceCollide((node: NodeObject<object>) => nodeRadius((node as NodeObject<GraphNode>).degree ?? 0) + 10))
  }, [])

  const handleEngineStop = useCallback(() => {
    setTimeout(() => graphRef.current?.zoomToFit(400, 48), 50)
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
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkCurvature={(link: LinkObject) => (link as unknown as GraphLink).curvature}
        backgroundColor="#fafaf9"
        cooldownTicks={300}
        d3AlphaDecay={0.025}
        d3VelocityDecay={0.35}
        onEngineStop={handleEngineStop}
      />
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm">
        {(Object.entries(KINGDOM_COLOR) as [Kingdom, string][]).map(([k, color]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
            <span className="text-xs capitalize text-stone-600">{k}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
