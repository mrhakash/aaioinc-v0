"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

/* ─────────────────────────────────────────────────
   Types
───────────────────────────────────────────────── */
type Theme = "dark" | "light"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

/* ─────────────────────────────────────────────────
   Context
───────────────────────────────────────────────── */
const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
})

/* ─────────────────────────────────────────────────
   Provider
   - Dark-first design system: default = dark
   - Light mode = add `.light` class on <html>
   - Persisted to localStorage under key "aaio-theme"
   - Inline script in layout.tsx prevents flash on load
───────────────────────────────────────────────── */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")

  // Read saved preference once on mount (after hydration)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aaio-theme") as Theme | null
      if (saved === "light") {
        setThemeState("light")
        document.documentElement.classList.add("light")
      } else {
        // Ensure dark (default) — remove .light if somehow present
        document.documentElement.classList.remove("light")
      }
    } catch {}
  }, [])

  const applyTheme = useCallback((next: Theme) => {
    setThemeState(next)
    if (next === "light") {
      document.documentElement.classList.add("light")
    } else {
      document.documentElement.classList.remove("light")
    }
    try { localStorage.setItem("aaio-theme", next) } catch {}
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark")
  }, [theme, applyTheme])

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t)
  }, [applyTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/* ─────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────── */
export function useTheme() {
  return useContext(ThemeContext)
}
