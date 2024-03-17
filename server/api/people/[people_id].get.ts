import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { people_id } = event.context.params

  const { data } = await client
    .from('people')
    .select(
      '*, dramas:drama_cast(*, drama:dramas(title, title_vi, release_year, poster_url))',
    )
    .eq('id', people_id)
    .single()

  return data
})
