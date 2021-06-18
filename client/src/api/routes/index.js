import { api } from '@/boot/axios'
const collection = '/routes'

export function select (params) {
  return api.get(collection, { params })
}
export async function getMeta (params) {
  return api.debonce({
    method: 'get',
    params: params,
    url: `${collection}/get-meta`
  })
}
export async function insert (params) {
  return api.post(collection, params)
}
export async function update (params) {
  return api.put(collection, params)
}
export async function updateOrder (params) {
  return api.put(`${collection}/update-order`, params)
}
export async function lock (params) {
  return api.patch(collection, params)
}
