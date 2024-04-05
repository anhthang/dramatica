import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id, created_at, date, dramas, ...rest } = await readBody(event)

  const { data, error } = await client.from('people').update(rest).eq('id', id)

  if (error) {
    throw createError(error.message)
  }

  return data
})
