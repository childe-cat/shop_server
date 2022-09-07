const express = require('express')
const router = express.Router()
// 引入路由配置模块
const {carousel_img,goods_img,goods_vip} =require('../router_handle/goods')
// 获取轮播图图片
router.get('/carousel',carousel_img)
// 获取畅销商品信息
router.get('/goods',goods_img)
// 获取主打商品信息
router.get('/vip',goods_vip)

module.exports = router