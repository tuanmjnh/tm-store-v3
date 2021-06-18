import { api } from '@/boot/axios'
const collection = '/user-setting'

export async function get (params) {
  return api.get(collection, { params })
}
export async function update (params) {
  return api.put(collection, params)
}
