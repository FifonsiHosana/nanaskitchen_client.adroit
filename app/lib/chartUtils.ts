import type { ChartGrouping } from "../store/use-analytics-store"

/**
 * Formats a GA4 dimension value for display in chart axes and tooltips.
 *
 * GA4 returns:
 *   date  → "20240401"
 *   month → "202404"
 *   hour  → "0" .. "23"
 */
export function formatChartLabel(
  value: string,
  grouping: ChartGrouping
): string {
  // if (grouping === "month") {
  //   // "202404" → "Apr 2024"
  //   const year = Number(value.slice(0, 4))
  //   const month = Number(value.slice(4, 6)) - 1
  //   return new Date(year, month).toLocaleDateString("en-US", {
  //     month: "short",
  //     year: "numeric",
  //   })
  // }

  if (grouping === "hour") {
    // "0" → "12 AM", "13" → "1 PM"
    const h = Number(value)
    const suffix = h < 12 ? "AM" : "PM"
    const display = h % 12 === 0 ? 12 : h % 12
    return `${display} ${suffix}`
  }

  if (grouping === "month") {
    // GA4 month dimension is just "1".."12", not "202401"
    const monthNum = Number(value) - 1
    return new Date(2000, monthNum).toLocaleDateString("en-US", {
      month: "short",
    })
    // → "Jan", "Feb" ... "Dec"
  }

  // date: "20240401" → "Apr 1"
  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(4, 6)) - 1
  const day = Number(value.slice(6, 8))
  return new Date(year, month, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}
