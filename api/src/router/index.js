const express = require('express')
const router = express.Router()

// Map router
const mapRouter = (controller) => {
  // console.log(controller.name)
  const route = router.route(`/${controller.name}`)
  if (controller.get) route.get(controller.get)
  if (controller.post) route.post(controller.post)
  if (controller.put) route.put(controller.put)
  if (controller.patch) route.patch(controller.patch)
  if (controller.delete) route.delete(controller.delete)
  // Extras
  if (controller.getAll) router.route(`/${controller.name}/get-all`).get(controller.getAll)
  if (controller.getSub) router.route(`/${controller.name}/get-sub`).get(controller.getSub)
  if (controller.find) router.route(`/${controller.name}/find`).get(controller.find)
  if (controller.select) router.route(`/${controller.name}/select`).post(controller.select)
  if (controller.exist) router.route(`/${controller.name}/exist`).get(controller.exist)
  if (controller.getKey) router.route(`/${controller.name}/get-key`).get(controller.getKey)
  if (controller.getMeta) router.route(`/${controller.name}/get-meta`).get(controller.getMeta)
  if (controller.getAttr) router.route(`/${controller.name}/get-attr`).get(controller.getAttr)
  if (controller.import) router.route(`/${controller.name}/import`).post(controller.import)
  if (controller.update) router.route(`/${controller.name}/update`).put(controller.update)
  if (controller.updateOrder) { router.route(`/${controller.name}/update-order`).put(controller.updateOrder) }
  // Extras users
  if (controller.verified) router.route(`/${controller.name}/verified`).post(controller.verified)
  if (controller.resetPassword) { router.route(`/${controller.name}/reset-password`).post(controller.resetPassword) }
  if (controller.changePassword) { router.route(`/${controller.name}/change-password`).post(controller.changePassword) }
}

// Import routers
mapRouter(require('../modules/configs/controller'))
mapRouter(require('../modules/routes/controller'))
mapRouter(require('../modules/users/controller'))
mapRouter(require('../modules/settings/controller'))
mapRouter(require('../modules/roles/controller'))
mapRouter(require('../modules/auth/controller'))
mapRouter(require('../modules/types/controller'))
mapRouter(require('../modules/categories/controller'))
mapRouter(require('../modules/news/controller'))
mapRouter(require('../modules/products/controller'))
mapRouter(require('../modules/product-imports/controller'))
mapRouter(require('../modules/product-exports/controller'))
// Controller Store report
const ProductReportsController = require('../modules/product-reports/controller')
router.route(`/${ProductReportsController.name}/total-orders`).get(ProductReportsController.totalOrders)
router.route(`/${ProductReportsController.name}/date`).get(ProductReportsController.date)
router.route(`/${ProductReportsController.name}/weekly`).get(ProductReportsController.weekly)
router.route(`/${ProductReportsController.name}/month`).get(ProductReportsController.month)
router.route(`/${ProductReportsController.name}/quarter`).get(ProductReportsController.quarter)
router.route(`/${ProductReportsController.name}/year`).get(ProductReportsController.year)
router.route(`/${ProductReportsController.name}/five-year`).get(ProductReportsController.fiveYear)
// Controller FileManager
const FileManagerController = require('../modules/file-manager/controller')
mapRouter(FileManagerController)
router.route(`/${FileManagerController.name}/folders`).get(FileManagerController.getFolders)
router.route(`/${FileManagerController.name}/files`).get(FileManagerController.getFiles)
// Test
mapRouter(require('../modules/test/controller'))

module.exports = router

// console.log(router)
