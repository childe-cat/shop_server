const express = require("express");

const router = express.Router()

// 引入路由配置模块
const {add_good} =require('../router_handle/manage')
// 添加商品
router.post('/add_goods',add_good)

module.exports = router