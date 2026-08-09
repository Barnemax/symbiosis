/** Neutral loading block. Uses the sunk-paper token so it reads as absent content in both themes. */
export default function Skeleton({ className = '' }: { className?: string }): React.JSX.Element {
  return <div className={`animate-pulse rounded bg-paper-sunk ${className}`} />
}
