import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id, ...rest } = await readBody(event)

  const table = rest.character_name ? 'drama_cast' : 'drama_crew'

  const { data, error } = id
    ? await client.from(table).update(rest).eq('id', id)
    : await client.from(table).insert(rest)

  if (error) {
    throw createError(error.message)
  }

  return data
})
