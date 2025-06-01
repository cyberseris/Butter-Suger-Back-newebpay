const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')
const isAuth = require('../middleware/isAuth.middleware')
const handleMiddleware = require('../utils/handleMiddleware')

// 取得單一訂單
router.get('/', ...handleMiddleware([isAuth], orderController.getOrder))





module.exports = router
