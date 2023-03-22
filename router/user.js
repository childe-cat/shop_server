const express =  require('express')
const router = express.Router()
//表单验证
const {register_verify} = require('../verify/user')
//引入路由处理函数模块
const user_handler = require('../router_handle/user')
//用户注册

router.post('/register',register_verify,user_handler.regUser)

//用户登录
router.post('/login',register_verify,user_handler.login)

// 管理员登录
router.post('/adminLogin',register_verify,user_handler.adminLogin)


module.exports = router