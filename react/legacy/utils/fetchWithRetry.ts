interface FetchWithRetry {
  (url: string, retries: number): Promise<PackagesSkuIds>
}

export const fetchWithRetry: FetchWithRetry = (url: string, retries: number) =>
  fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json()
      }

      if (retries > 0) {
        return fetchWithRetry(url, retries - 1)
      }

      throw new Error(`Failed to fetch: ${url}`)
    })
    .catch(error => console.error(error.message))
