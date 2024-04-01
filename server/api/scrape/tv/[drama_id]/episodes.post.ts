import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data, error } = await client.from('episodes').insert(body)

  if (error) {
    throw createError(error.message)
  }

  return data
})
