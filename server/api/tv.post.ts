import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { date, ...rest } = await readBody(event)

  const { data } = await client.from('dramas').insert(rest)

  return data
})
