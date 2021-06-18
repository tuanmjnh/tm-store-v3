const express = require('express')
const router = express.Router()

// Map router
const mapRouter = (controller) => {
  const route = router.route(`/${controller.name}`)
  if (controller.get) route.get(controller.get)
  if (controller.post) route.post(controller.post)
  if (controller.put) route.put(controller.put)
  if (controller.patch) route.patch(controller.patch)
  if (controller.delete) route.delete(controller.delete)
  // Extras
  if (controller.find) router.route(`/${controller.name}/find`).get(controller.find)
  if (controller.exist) router.route(`/${controller.name}/exist`).get(controller.exist)
  if (controller.getKey) router.route(`/${controller.name}/get-key`).get(controller.getKey)
  if (controller.getMeta) router.route(`/${controller.name}/get-meta`).get(controller.getMeta)
  if (controller.import) router.route(`/${controller.name}/import`).post(controller.import)
  if (controller.updateOrder) { router.route(`/${controller.name}/update-order`).put(controller.updateOrder) }
  // Extras users
  if (controller.verified) router.route(`/${controller.name}/verified`).post(controller.verified)
  if (controller.resetPassword) { router.route(`/${controller.name}/reset-password`).post(controller.resetPassword) }
  if (controller.changePassword) { router.route(`/${controller.name}/change-password`).post(controller.changePassword) }
}

// Import routers
mapRouter(require('../controllers/routes'))
mapRouter(require('../controllers/users'))
mapRouter(require('../controllers/users/settings'))
mapRouter(require('../controllers/roles'))
mapRouter(require('../controllers/auth'))
mapRouter(require('../controllers/types'))
mapRouter(require('../controllers/categories'))
mapRouter(require('../controllers/news'))
mapRouter(require('../controllers/products'))
mapRouter(require('../controllers/store/imports'))
mapRouter(require('../controllers/store/exports'))
// Controller Store report
const StoreReportsController = require('../controllers/store/reports')
router.route(`/${StoreReportsController.name}`).get(StoreReportsController.date)
router.route(`/${StoreReportsController.name}/weekly`).get(StoreReportsController.weekly)
router.route(`/${StoreReportsController.name}/month`).get(StoreReportsController.month)
router.route(`/${StoreReportsController.name}/quarter`).get(StoreReportsController.quarter)
router.route(`/${StoreReportsController.name}/year`).get(StoreReportsController.year)
router.route(`/${StoreReportsController.name}/five-year`).get(StoreReportsController.fiveYear)
// Controller FileManager
const FileManagerController = require('../controllers/file-manager')
mapRouter(FileManagerController)
router
  .route(`/${FileManagerController.name}/directories`)
  .get(FileManagerController.getDirectories)
router.route(`/${FileManagerController.name}/files`).get(FileManagerController.getFiles)
// Test
mapRouter(require('../controllers/test'))

module.exports = router
