export const PercentageBar = ({
  percentage,
  color = "#4caf50",
  backgroundColor = "#42444d",
  showLabel = true,
}: {
  percentage: number
  color?: string
  backgroundColor?: string
  showLabel?: boolean
}) => {
  // Ensure percentage stays within 0-100
  const safePercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div
      className="min-w-4/7 rounded-sm border-2 border-black"
      style={{ backgroundColor }}
      role="progressbar"
      aria-valuenow={safePercentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="rounded-sm border ring-1 ring-green-500"
        style={{
          width: `${safePercentage}%`,
          backgroundColor: color,
        }}
      >
        {showLabel && (
          <span className="ml-2 text-xs font-semibold text-white">
            {safePercentage}%
          </span>
        )}
      </div>
    </div>
  )
}
