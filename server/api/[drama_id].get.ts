import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { drama_id } = event.context.params

  const { data } = await client
    .from('dramas')
    .select('*, cast:drama_cast(*), crew:drama_crew(*)')
    .eq('id', drama_id)

  return data
})
