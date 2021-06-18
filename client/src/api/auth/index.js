import { api } from '@/boot/axios'
const collection = '/auth'

export async function checkToken (params) {
  return api.get(collection, { params })
}
export async function login (params) {
  return api.post(collection, params)
}
