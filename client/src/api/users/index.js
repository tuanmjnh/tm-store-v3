import { api } from '@/boot/axios'
const collection = '/users'

export async function select (params) {
  return api.get(collection, { params })
}
export async function insert (params) {
  return api.post(collection, params)
}
export async function update (params) {
  return api.put(collection, params)
}
export async function changePassword (params) {
  return api.post(`${collection}/change-password`, params)
}
export async function resetPassword (params) {
  return api.post(`${collection}/reset-password`, params)
}
export async function lock (params) {
  return api.patch(collection, params)
}
export async function imports (params) {
  return api.post(`${collection}/import`, params)
}
