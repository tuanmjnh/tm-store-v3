import { api } from '@/boot/axios'
const collection = '/store-imports'

export async function select (params) {
  return api.get(collection, params)
}
export async function finds (params) {
  return api.post(collection, params)
}
export async function imports (params) {
  return api.put(collection, params)
}
