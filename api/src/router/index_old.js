const express = require('express');
const router = express.Router();
// Controller
const fileManager = require('../controllers/file-manager');
const auth = require('../controllers/auth');
const users = require('../controllers/users');
const userSetting = require('../controllers/users/settings');
const roles = require('../controllers/roles');
const routes = require('../controllers/routes');
const types = require('../controllers/types');
const categories = require('../controllers/categories');
const news = require('../controllers/news');
const products = require('../controllers/products');
const productImports = require('../controllers/store/imports');
const productExports = require('../controllers/store/exports');
const productReports = require('../controllers/store/reports');

// upload data
// router
//   .route('/filemanager/')
//   .get(filemanager.get)
//   .post(filemanager.upload, filemanager.post)
router.route('/file-manager/').get(fileManager.get).post(fileManager.post);
router.route('/file-manager/directories').get(fileManager.getDirectories);
router.route('/file-manager/files').get(fileManager.getFiles);
// auth
router.route('/auth/:id?').get(auth.get).post(auth.post);

// User
router
  .route('/users')
  .get(users.select)
  .post(users.insert)
  .put(users.update)
  .patch(users.lock)
  .delete(users.delete);
router.route('/users/find').get(users.find);
router.route('/users/verified').post(users.verified);
router.route('/users/reset-password').post(users.resetPassword);
router.route('/users/change-password').post(users.changePassword);

// User
router.route('/user-setting').get(userSetting.select).put(userSetting.update);

// Roles
router
  .route('/roles')
  .get(roles.select)
  .post(roles.insert)
  .put(roles.update)
  .patch(roles.lock)
  .delete(roles.delete);
router.route('/roles/find').get(roles.find);

// Routes
router
  .route('/routes')
  .get(routes.select)
  .post(routes.insert)
  .put(routes.update)
  .patch(routes.lock)
  .delete(routes.delete);
router.route('/routes/find').get(routes.find);
router.route('/routes/get-meta').get(routes.getMeta);
// router.route('/routes/template').get(routes.insertTemplate)
router.route('/routes/update-order').put(routes.updateOrder);
// Types
router
  .route('/types')
  .get(types.select)
  .post(types.insert)
  .put(types.update)
  .patch(types.lock)
  .delete(types.delete);
router.route('/types/find').get(types.find);
router.route('/types/get-key').get(types.getKey);
router.route('/types/get-meta').get(types.getMeta);
// Categories
router
  .route('/categories')
  .get(categories.select)
  .post(categories.insert)
  .put(categories.update)
  .patch(categories.lock)
  .delete(categories.delete);
router.route('/categories/find').get(categories.find);
router.route('/categories/get-attr').get(categories.getAttr);
router.route('/categories/update-order').put(categories.updateOrder);
// News
router
  .route('/news')
  .get(news.select)
  .post(news.insert)
  .put(news.update)
  .patch(news.lock)
  .delete(news.delete);
router.route('/news/find').get(news.find);
router.route('/news/get-attr').get(news.getAttr);
// Products
router
  .route('/products')
  .get(products.select)
  .post(products.insert)
  .put(products.update)
  .patch(products.lock)
  .delete(products.delete);
router.route('/products/find').get(products.find);
router.route('/products/exist').get(products.exist);
router.route('/products/get-attr').get(products.getAttr);
// product imports
router.route('/product-imports').get(productImports.select);
router.route('/product-imports').post(productImports.finds);
router.route('/product-imports').put(productImports.imports);
// product exports
router.route('/product-exports').get(productExports.select);
router.route('/product-exports').post(productExports.finds);
router.route('/product-exports').put(productExports.exports);
// product report
router.route('/product-reports').get(productReports.date);
router.route('/product-reports/weekly').get(productReports.weekly);
router.route('/product-reports/month').get(productReports.month);
router.route('/product-reports/quarter').get(productReports.quarter);
router.route('/product-reports/year').get(productReports.year);
router.route('/product-reports/five-year').get(productReports.fiveYear);

// router
//   .route('/employees/:id?')
//   .get(employees.get)
//   .post(employees.post)
//   .put(employees.put)
//   .delete(employees.delete)

module.exports = router;
