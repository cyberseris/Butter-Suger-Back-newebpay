const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'order_item', // 實體的名稱
  tableName: 'order_item', // 對應的資料表名稱
  columns: {
        id: {
            primary: true, // 設定為主鍵
            type: 'uuid', // 資料型別為 UUID
            generated: 'uuid', // 設定為 UUID 自動生成
        },
        order_id: {
            type: 'uuid',
            nullable: false,
        },
        course_id: {
            type: 'uuid',
            nullable: false,
        },
        price: {
            type: 'integer',
            nullable: false     
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
        }
    }
})
