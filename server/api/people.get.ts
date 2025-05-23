import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { query } = getQuery(event)

  const fts = query
    ?.toString()
    .trim()
    .split(/[\s,\t,\n]+/) // split and remove more than 1 space
    .join(' | ')

  const { data, error } = await client
    .from('people')
    .select()
    .textSearch('name', `${fts}`)
    .limit(10)

  if (error) {
    throw createError(error.message)
  }

  return data
})
