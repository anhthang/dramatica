import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id, title_year, ...rest } = await readBody(event)

  let query
  if (id) {
    query = client.from('drama_translations').update(rest).eq('id', id)
  } else {
    query = client.from('drama_translations').insert(rest)
  }

  const { data, error } = await query

  if (error) {
    throw createError(error.message)
  }

  return data
})
