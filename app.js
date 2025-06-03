const express = require('express')
const cors = require('cors')
const path = require('path')
const pinoHttp = require('pino-http')
const logger = require('./utils/logger')('App')
const userRouter = require('./routes/users.route')
const teacherRouter = require('./routes/teacher.route')
const courseRoutes = require('./routes/courses.route')
const coursesRouter = require('./routes/courses.route')
const cartRouter = require('./routes/cart.route')
const orderRouter = require('./routes/order.route')
const errorHandler = require('./middleware/errorHandler.middleware') // 引入錯誤處理
require('dotenv').config()
// 引入 passport 配置
const passport = require('./config/passport')
const session = require('express-session')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


const app = express()
app.use(cors())

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://buttersuger-frontend.zeabur.app',
  'https://buttersuger-test.zeabur.app',
]
/* app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true) // 允許請求
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
) */
app.use(express.json())
/* app.use(express.urlencoded({ extended: false })) */
app.use(express.urlencoded({ extended: true }))
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body, // 這樣就不會破壞掉原本的 req.body
        }
      },
    },
  })
)
app.use(express.static(path.join(__dirname, 'public')))

// 設定 session 和 passport
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 使用你的 session secret
    resave: false,
    saveUninitialized: false, // 在沒有改變 session 時不會保存 session
  })
)
app.use(passport.initialize()) // 初始化 passport
app.use(passport.session()) // 使用 session

app.use('/api/v1/users', userRouter)
app.use('/api/v1/teacher', teacherRouter)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/courses', coursesRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 讓錯誤處理 middleware 做全域錯誤處理
app.use(errorHandler)

module.exports = app
