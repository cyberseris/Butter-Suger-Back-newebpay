const { dataSource } = require('../db/data-source')
const { appError, sendResponse } = require('../utils/responseFormat')
const cleanUndefinedFields = require('../utils/cleanUndefinedFields')

const orderController = {
    //取得單一訂單
    async getOrder(req, res, next){

        return res.status(200).json({
            status: true,
            message: "getOrder"
        })
    },

    //取得所有訂單
    async getOrderList(req, res, next){
        const user_id = req.user.id
        
        const orderRepo = dataSource.getRepository('order')
        const findOrder = await orderRepo.find({
            select: ['id', 'order_number', 'final_amount', 'created_at'],
            where:{ user_id: user_id }
        })

        console.log("================getOrderList findOrder================")
        console.log(findOrder)
        console.log("================getOrderList findOrder================")

        if(!findOrder){
            return res.status(200).json({
                status: true,
                message: "目前沒有訂單"
            })      
        }

        const orderItemRepo = dataSource.getRepository('order_item')
        const orderItemList = await orderItemRepo.find({
            select: ['id'],
            where: {order_id: findOrder.id},
            relations: ['courses']
        })
        
        console.log("================getOrderList orderItemList================")
        console.log(orderItemList)
        console.log("================getOrderList orderItemList================")

        const course_name = orderItemList.map(item => item.courses.course_name)

        console.log("================getOrderList course_name================")
        console.log(course_name)
        console.log("================getOrderList course_name================")

        return res.status(200).json({
            status: true,
            message: "成功取得訂單",
            data: {
                order_number: findOrder.order_number,
                course_name: course_name,
                final_amount: findOrder.final_amount,
                created_at: findOrder.created_at
            }
        })
    },
}

module.exports = orderController