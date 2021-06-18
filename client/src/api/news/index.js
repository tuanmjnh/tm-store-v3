import { api } from '@/boot/axios'
const collection = '/news'

export async function select (params) {
  return api.get(collection, { params })
}
export async function getAttr (params) {
  return api.debonce({
    method: 'get',
    params: params,
    url: `${collection}/get-attr`
  })
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
