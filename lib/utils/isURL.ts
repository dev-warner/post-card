export function isURL(url: string) {
  try {
    const _url = new URL(url)

    return true
  } catch (err) {
    return false
  }
}
