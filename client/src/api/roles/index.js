import { api } from '@/boot/axios'
const collection = '/roles'

export async function select (params) {
  return api.get(collection, { params })
}
export async function find (params) {
  return api.get(`${collection}/find`, { params })
}
export async function insert (params) {
  return api.post(collection, params)
}
export async function update (params) {
  return api.put(collection, params)
}
export async function lock (params) {
  return api.patch(collection, params)
}
