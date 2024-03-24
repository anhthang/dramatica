import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query } = getQuery(event)

  let sqlQuery
  if (query) {
    // const fts = query
    //   .toString()
    //   .trim()
    //   .split(/[\s,\t,\n]+/) // split and remove more than 1 space
    //   .join(' | ')

    sqlQuery = client.from('dramas').select().eq('title', query).limit(10)
  } else {
    sqlQuery = client.from('dramas').select()
  }

  const { data } = await sqlQuery

  return data
})
