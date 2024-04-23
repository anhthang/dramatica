import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('genres').select('id, name')

  if (error) {
    throw createError(error.message)
  }

  return data
})
