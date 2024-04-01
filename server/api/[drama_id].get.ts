import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const drama_id = getRouterParam(event, 'drama_id')

  const { data } = await client
    .from('dramas')
    .select(
      `*,
      availability:drama_availability(*),
      cast:drama_cast(*, people(name, name_vi, profile_url)),
      crew:drama_crew(*),
      episodes(*),
      genres:drama_genres(genre:genres(name)),
      translations:drama_translations(*)
      `,
    )
    .eq('id', drama_id)
    .single()

  return data
})
