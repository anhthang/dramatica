import fetcher from '../lib'

export default defineEventHandler(async (event) => {
  const { url, source } = getQuery(event)

  return fetcher[source](url)
})
