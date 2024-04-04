import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { date, ...rest } = await readBody(event)

  const { data, error } = await client
    .from('people')
    .insert(rest)
    .select('id')
    .single()

  if (error) {
    throw createError(error.message)
  }

  return data
})
