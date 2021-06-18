import { api } from '@/boot/axios'
const collection = '/types'

export function select (params) {
  return api.get(collection, { params })
}
export function find (params) {
  return api.get(`${collection}/find`, { params })
}
export function getKey (params) {
  return api.debonce({
    method: 'get',
    params: params,
    url: `${collection}/get-key`
  })
}
export function getMeta (params) {
  return api.debonce({
    method: 'get',
    params: params,
    url: `${collection}/get-meta`
  })
}
export function insert (params) {
  return api.post(collection, params)
}
export function update (params) {
  return api.put(collection, params)
}
export function lock (params) {
  return api.patch(collection, params)
}
