// 加密包
const bcrypt = require('bcryptjs')
// 链接数据库
const db = require('../db/index')
//验证规则
const {validationResult} = require("express-validator")
//查询用户个人信息
exports.userinfo = (req, res) => {
	const sql = `select username,nickname,img_url,vip,residual from user where id = ?`
	db.query(sql, req.user.id, (err, result) => {
		if (err) return res.mt(err)
		if (result.length !== 1) return res.mt('获取用户信息失败')
		res.send({
			status: 0,
			message: '获取用户基本信息成功',
			data: result[0]
		})
	})
}
// 查询充值记录
exports.skype = (req,res)=>{
	const sql =`select *from skype where username = ?`
	db.query(sql,req.user.username,(err,result)=>{
		if(err) res.mt(err)
		res.send({
			status:0,
			message:'获取充值记录成功',
			data:result
		})
	})
}
// 修改密码
exports.revise_password = (req,res)=>{
	//验证失败报错
	let err = validationResult(req);
	if(!err.isEmpty()) return res.mt(err.mapped())
	const old_password = req.body.old_password
	let new_password = req.body.password
	const sel_sql = `select password from user where username = ?`
	db.query(sel_sql,req.user.username,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length<=0) return res.mt('??疑惑??出错??')
		const flag = bcrypt.compareSync(old_password,result[0].password)
		if(!flag) return res.mt('旧密码错误')
		// 密码加密
		let password = bcrypt.hashSync(new_password,10)
		const sql = `update user set password = ? where username = ?`
		// 修改密码
		db.query(sql,[password,req.user.username],(err,result)=>{
			if(err) res.mt(err)
			if(result.affectedRows!==1) res.mt('修改失败')
			res.send({
				status:0,
				message:'修改成功',
			})
		})
	})
}
// 获取用户购物车信息
exports.cart_list = (req, res) => {
	// 获取购物车里的商品标识
	const sql = `select *from cart where username = ? and num >0`
	db.query(sql, req.user.username, (err, result) => {
		if (err) return res.mt(err)
		if (false) return res.mt('当前用户购物车没有数据')
		// 存放标识
		let arr1 = []
		// 存放商品数量
		let obj = new Object()
		// 遍历给每一项商品添加数量
		result.forEach((item) => {
			arr1.push(item.tag)
			obj[item.tag] = item.num
		})
		// 通过标识查找对应商品
		const cartsql = `select *from blurb where find_in_set(id,?)`
		db.query(cartsql, arr1.join(), (err, result) => {
			if (err) return res.mt(err)
			if (result.length < 0) return res.mt('购物车没有商品')
			// 将购物车商品数量加在返回结果集里
			result.forEach(item => {
				for (const key in obj) {
					if (item.id == key) {
						item.num = obj[key]
					}
				}
			})
			res.send({
				status: 0,
				message: '获取用户购物车信息成功',
				data: result
			})
		})
	})
}
// 添加购物车
exports.add_cart = (req, res) => {
	const cart = {
		username: req.user.username,
		tag: req.body.tag
	}
	const selsql = `select num from cart where username = ? and tag = ?`
	if (cart.tag <= 0) return res.mt('商品标识错误')
	db.query(selsql, [cart.username, cart.tag], (err, result) => {
		if (err) return res.mt(err)
		if (result < 0) return res.mt('数据错误')
		if (result == 0) {
			// 购物车没有商品信息就添加一条商品数据
			const inssql = `insert into cart set ?`
			db.query(inssql, cart, (err, result) => {
				if (err) return res.mt(err)
				console.log(1);
				if (result.affectedRows == 1) {
					res.send({
						status: 0,
						message: '添加成功'
					})
				}
			})
		}
		// 已经存在所选商品数据了就添加商品数量
		if (result.length > 0) {
			const updsql = `update cart set num = ? where tag = ?`
			let num = ++result[0].num;
			db.query(updsql, [num, cart.tag], (err, result) => {
				if (err) return res.mt(err)
				if (result.affectedRows == 1) {
					console.log('成功');
					res.send({
						status: 0,
						message: '添加成功'
					})
				}
			})
		}
	})
}
// 删除购物车
exports.del_cart = (req, res) => {
	const cart = {
		username: req.user.username,
		tag: req.body.tag
	}
	const selsql = `select num from cart where username = ? and tag = ?`
	if (cart.tag <= 0) return res.mt('商品标识错误')
	db.query(selsql, [cart.username, cart.tag], (err, result) => {
		if (err) return res.mt(err)
		if (result.length < 0) return res.mt('数据错误')
		const delsql = `delete from cart where tag = ?`
		const updsql = `update cart set num = ? where tag = ?`
		let num = --result[0].num;
		// num为0时删除记录
		if (num == 0) {
			db.query(delsql, cart.tag, (err, result) => {
				if (err) return res.mt(err)
				if (result.affectedRows == 1) {
					res.send({
						status: 0,
						message: '删除成功'
					})
				}
			})
		} else {
			// 非0减1
			db.query(updsql, [num, cart.tag], (err, result) => {
				if (err) return res.mt(err)
				if (result.affectedRows == 1) {
					res.send({
						status: 0,
						message: "删除成功"
					})
				}
			})
		}

	})
}
// 查询优惠卷
exports.kfc = (req, res) => {
	const receive_sql = `select *from kfc_receive where user_id = ? and status = 0`
	db.query(receive_sql, req.user.id, (err, result) => {
		if (err) return res.mt(err)
		if (result.length <= 0) return res.send({
			status: 0,
			message: '没有优惠卷'
		})
		if (result.length > 0) {
			let user = result
			let user_kfc = []
			user.forEach((item, i) => {
				user_kfc[i] = item.kfc_id
			})
			const kfc_sql = `select *from kfc where find_in_set(id,?)`
			db.query(kfc_sql,user_kfc.join(),(err, result) => {
				if (err) return res.mt(err)
				if (result <= 0) return res.send({
					status: 0,
					message: '没有优惠卷'
				})
				user.forEach(a=>{
					result.forEach(b=>{
						if(a.kfc_id==b.id){
							a.content = b
						}
					})
				})
				res.send({
					status:0,
					message:'获取优惠卷成功',
					data:user
				})
			})
		}
	})
}
