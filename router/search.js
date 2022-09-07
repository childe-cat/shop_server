const express = require('express')
const router = express.Router()
// 引入路由配置模块
const {search_classify,search_goods,search_classifyGoods,search_goods_id} = require('../router_handle/search')
// 获取所有分类
router.get('/classify',search_classify)
// 根据关键字查询商品信息
router.post('/search',search_goods)
// 根据id获取商品信息
router.post('/search_id',search_goods_id)
// 获取指定类别商品
router.post('/search_classify',search_classifyGoods)

module.exports = router