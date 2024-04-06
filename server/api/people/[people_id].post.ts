import { serverSupabaseClient } from '#supabase/server'
import pick from 'lodash.pick'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const people = pick(body, [
    'name',
    'native_name',
    'name_vi',
    'profile_url',
    'biography',
    'dob',
    'gender',
    'weibo',
    'douyin',
    'instagram',
  ])

  const { data, error } = await client
    .from('people')
    .update(people)
    .eq('id', body.id)

  if (error) {
    throw createError(error.message)
  }

  return data
})
