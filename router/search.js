const express = require('express')
const router = express.Router()
// 引入路由配置模块
const {search_classify,search_goods,search_classifyGoods,search_goods_id,all_goods} = require('../router_handle/search')
// 获取所有分类
router.get('/classify',search_classify)
// 根据关键字查询商品信息
router.post('/search',search_goods)
// 根据id获取商品信息
router.post('/search_id',search_goods_id)
// 获取指定类别商品
router.post('/search_classify',search_classifyGoods)
// 获取所有商品信息
router.get('/all_goods',all_goods)

module.exports = router