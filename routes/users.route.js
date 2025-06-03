const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/user.controller')
const orderController = require('../controllers/order.controller')
const isAuth = require('../middleware/isAuth.middleware')
const validateSchema = require('../middleware/validateSchema.middleware')
const { updateUserSchema } = require('../schema/user.schema')
const handleMiddleware = require('../utils/handleMiddleware')
const multer = require('multer');
const upload = multer();

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline', // 這個參數會要求 Google 返回 refresh token
    prompt: 'consent', // 這個參數會強制 Google 顯示授權頁面，即使用戶之前已經授權過
  })
)
// Passport 會使用收到的 code 去向 Google 請求交換用戶資料。如果成功，req.user 會包含來自 Google 的用戶資料，然後儲存用戶資料。
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/failed',
  }),
  userController.getGoogleProfile // ⬅️ 呼叫你剛剛寫的 getGoogleProfile
)

// 取得使用者資料
/**
 * @swagger
 * /api/v1/users/info:
 *   get:
 *     summary: 取得使用者資料
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功取得使用者資料
 *       401:
 *         description: 權限不足
 *       404:
 *         description: 查無個人資料，請重新登入
 */
router.get('/info', ...handleMiddleware([isAuth], userController.getUserData))

// 驗證使用者是否登入
/**
 * @swagger
 * /api/v1/users/check:
 *   get:
 *     summary: 驗證使用者是否登入
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 驗證成功
 *       401:
 *         description: 驗證錯誤，token 無效或是不存在
 */
router.get('/check', ...handleMiddleware([isAuth], userController.getCheck))

//更新使用者資料
/**
 * @swagger
 * /api/v1/users/update:
 *   get:
 *     summary: 編輯使用者資料
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功更新使用者資料
 *       400:
 *         description: 更新失敗，請稍後再試
 *       404:
 *         description: 查無個人資料，請重新登入 
 */
router.patch(
  '/update',
  ...handleMiddleware([upload.single('file'), isAuth, validateSchema(updateUserSchema), userController.updateUserData])
)

// 取得所有訂單
router.get('/orders', ...handleMiddleware([isAuth], orderController.getOrderList))

module.exports = router
