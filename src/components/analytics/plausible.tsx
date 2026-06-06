import { useEffect } from "react"

/**
 * Plausible Analytics
 * https://plausible.io
 *
 * 仅在生产环境且配置了 VITE_PLAUSIBLE_SCRIPT 时加载。
 * 脚本注入延迟到浏览器空闲时，避免与 LCP/初始水合竞争。
 */
export function PlausibleAnalytics() {
  useEffect(() => {
    if (!import.meta.env.PROD) return
    const script = import.meta.env.VITE_PLAUSIBLE_SCRIPT
    if (!script) return

    let injected: HTMLScriptElement | null = null
    let cancel: (() => void) | null = null

    const inject = () => {
      injected = document.createElement("script")
      injected.id = "plausible-analytics"
      injected.src = script
      injected.async = true
      injected.defer = true
      document.head.appendChild(injected)
    }

    type RIC = (cb: () => void, opts?: { timeout?: number }) => number
    const ric = (window as unknown as { requestIdleCallback?: RIC })
      .requestIdleCallback
    if (typeof ric === "function") {
      const handle = ric(inject, { timeout: 3000 })
      cancel = () => {
        const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void })
          .cancelIdleCallback
        cic?.(handle)
      }
    } else {
      const handle = window.setTimeout(inject, 1500)
      cancel = () => window.clearTimeout(handle)
    }

    return () => {
      cancel?.()
      if (injected?.parentNode) {
        injected.parentNode.removeChild(injected)
      }
    }
  }, [])

  return null
}