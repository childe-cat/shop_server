const express = require('express')
const app = express()
const expressWs = require('express-ws')

//接受body数据
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//cors跨域
const cors = require('cors')
app.use(cors())
//解析表单数据
app.use(express.urlencoded({
	extended: true
}))

//封装错误中间件
app.use((req, res, next) => {
	res.mt = (err, status = 1) => {
		res.send({
			status,
			message: err instanceof Error ? err.message : err
		})
	}
	next()
})

//解析token中间件
const config = require('./configure')
const expressJWT = require('express-jwt')
// 普通用户
app.use(expressJWT({
	secret: config.jwtSecretKey
}).unless({
	path: [/^\/api/,/^\/manage/,/^\/ws/]
}))
// 管理员
app.use(expressJWT({
	secret: config.jwtSecretKey_admin
}).unless({
	path: [/^\/api/,/^\/my/,/^\/pay/]
}))

// express托管静态资源
app.use('/api', express.static(__dirname + '/static'))
//导入路由模块
// webSocket服务
const ws = require('./router_handle/ws')
expressWs(app)
app.use('/ws',ws)
// 用户
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 用户信息
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 搜索
const searchRouter = require('./router/search')
app.use('/api', searchRouter)
// 商品信息
const goodsRouter = require('./router/goods')
app.use('/api',goodsRouter)
// 支付
const payRouter = require('./router/pay')
app.use('/pay',payRouter)
// 后台管理
const manageRouter = require('./router/manage')
app.use('/manage',manageRouter)

//token错误级别的中间件
app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') return res.mt('身份认证失败')
})

app.listen(80, () => {
	console.log('http://127.0.0.1');
})
