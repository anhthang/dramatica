import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query } = getQuery(event)

  let sqlQuery
  if (query) {
    const fts = query
      .toString()
      .trim()
      .split(/[\s,\t,\n]+/) // split and remove more than 1 space
      .join(' | ')

    sqlQuery = client
      .from('dramas')
      .select()
      .textSearch('title', `${fts}`)
      .order('release_year', { ascending: false })
      .order('title')
      .limit(10)
  } else {
    sqlQuery = client
      .from('dramas')
      .select()
      .order('release_year', { ascending: false })
      .order('title')
  }

  const { data, error } = await sqlQuery

  if (error) {
    throw createError(error.message)
  }

  return data
})
