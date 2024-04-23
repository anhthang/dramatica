import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { dates, tv_genres, ...rest } = await readBody(event)

  const { data, error } = await client
    .from('dramas')
    .insert(rest)
    .select('id')
    .single()

  if (error) {
    throw createError(error.message)
  }

  if (Array.isArray(tv_genres) && tv_genres.length) {
    const tvGenres = tv_genres.map((genre_id) => ({
      genre_id,
      drama_id: data.id,
    }))

    const { error } = await client.from('drama_genres').insert(tvGenres)

    if (error) {
      throw createError(error.message)
    }
  }

  return data
})
