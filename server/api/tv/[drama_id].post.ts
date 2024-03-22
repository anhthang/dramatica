import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { date, ...rest } = await readBody(event)

  const { data } = await client.from('drama_cast').insert(rest)

  return data
})
