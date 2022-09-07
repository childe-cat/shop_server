const express = require('express')
const router = express.Router()
//表单验证
const {revise_verify} = require('../verify/user')
//导入路由处理函数
const userinfo = require('../router_handle/userinfo')
//查询个人信息
router.get('/userinfo',userinfo.userinfo)
// 查询充值记录
router.get('/skype',userinfo.skype)
// 修改密码
router.post('/revise_password',revise_verify,userinfo.revise_password)
// 获取购物车信息
router.get('/cart_list',userinfo.cart_list)
// 添加购物车
router.post('/add_cart',userinfo.add_cart)
// 删除购物车
router.post('/del_cart',userinfo.del_cart)
// 查询优惠卷
router.get('/kfc_receive',userinfo.kfc)

module.exports = router