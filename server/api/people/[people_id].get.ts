import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { people_id } = event.context.params

  const { data, error } = await client
    .from('people')
    .select(
      `*,
      dramas:drama_cast(*, drama:dramas(title, title_vi, release_year, poster_url, airing_status)),
      drama_crew(*, drama:dramas(title, title_vi, release_year, poster_url, airing_status))
      `,
    )
    .eq('id', people_id)
    .single()

  if (error) {
    throw createError(error.message)
  }

  if (data) {
    data.dramas = data.dramas.concat(data.drama_crew)
    delete data.drama_crew
  }

  return data
})
