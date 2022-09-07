const express =  require('express')
const router = express.Router()

const pay_handle = require('../router_handle/pay')
// 查询订单
router.get('/search_order',pay_handle.search_order)
// 删除订单
router.post('/del_order',pay_handle.del_order)
// 生成未支付订单
router.post('/add_order',pay_handle.add_order)
// 支付成功订单状态更改为待处理
router.post('/pay_order',pay_handle.pay_order)

module.exports = router