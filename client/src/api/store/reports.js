import { api } from '@/boot/axios'
const collection = '/store-reports'

export async function date (params) {
  return api.get(collection, { params: params })
}
export async function weekly (params) {
  return api.get(`${collection}/weekly`, { params: params })
}
export async function month (params) {
  return api.get(`${collection}/month`, { params: params })
}
export async function quarter (params) {
  return api.get(`${collection}/quarter`, { params: params })
}
export async function year (params) {
  return api.get(`${collection}/year`, { params: params })
}
export async function fiveYear (params) {
  return api.get(`${collection}/five-year`, { params: params })
}
