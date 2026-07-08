import { useEffect, useState } from "react"
import { useTheme } from "../components/theme-provider"

export function useIsDark() {
  const { theme } = useTheme()
  const [systemDark, setSystemDark] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return theme === "dark" || (theme === "system" && systemDark)
}
