import { api } from '@/boot/axios'
const collection = '/products'

export async function select (params) {
  return api.get(collection, { params })
}
export async function find (params) {
  return api.get(`${collection}/find`, { params })
}
export async function exist (params) {
  return api.get(`${collection}/exist`, { params })
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
export async function loadFileImport (params) {
  return api.post(`${collection}/load-file-import`, params)
}
export async function finds (params) {
  return api.post(`${collection}/finds`, params)
}
export async function imports (params) {
  return api.post(`${collection}/imports`, params)
}
