const { DataSource } = require('typeorm')
const config = require('../config/index')

const users = require('../entities/users.entity')
const courses = require('../entities/courses.entity')
const courseCategory = require('../entities/course_category.entity')
const courseSection = require('../entities/course_section.entity')
const courseSubsection = require('../entities/course_subsection.entity')
const teacher = require('../entities/teacher.entity')
const ratings = require('../entities/ratings.entity')
const carts = require('../entities/carts.entity')
const cart_items = require('../entities/cart_items.entity')
const order = require('../entities/order.entity')
const coupon = require('../entities/coupon.entity')
const user_coupon = require('../entities/user_coupon.entity')

const dataSource = new DataSource({
  type: 'postgres',
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  synchronize: config.get('db.synchronize'),
  schema: "public",
  poolSize: 10,
  entities: [ users, courses , courseCategory , courseSection, courseSubsection , teacher, ratings, carts, cart_items, order, coupon, user_coupon],
  ssl: config.get('db.ssl'),
})

module.exports = { dataSource }
