import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id, created_at, cast, crew, date, genres, episodes, ...rest } =
    await readBody(event)

  const { data } = await client.from('dramas').update(rest).eq('id', id)

  return data
})
