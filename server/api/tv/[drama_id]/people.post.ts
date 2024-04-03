import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const table = body.character_name ? 'drama_cast' : 'drama_crew'

  const { data, error } = await client.from(table).insert(body)

  if (error) {
    throw createError(error.message)
  }

  return data
})
