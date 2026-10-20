export interface BuildInfo {
  sha: string
  branch: string
  builtAt: string
}

/** "Build 1a2b3c4 · main · Oct 20, 9:41 PM" */
export function describeBuild(
  info: BuildInfo = __BUILD_INFO__,
  options: { locale?: string; timeZone?: string } = {},
): string {
  const builtAt = new Date(info.builtAt)
  const when = Number.isNaN(builtAt.getTime())
    ? ''
    : builtAt.toLocaleString(options.locale, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: options.timeZone,
      })
  return [`Build ${info.sha.slice(0, 7)}`, info.branch, when].filter(Boolean).join(' · ')
}
