const db = require('../db/index')
const { login } = require('./user')
// 充值M币
// 查询订单信息
exports.search_order = (req,res) =>{
	const order_sql = "select *from `order` where username = ?"
	db.query(order_sql,req.user.username,(err,results)=>{
		if(err) res.mt(err)
		let arr = results.sort((a,b)=>{
			return b.id - a.id
		})
		// 转换时间戳!!!
		res.send({
			status:0,
			message:'获取订单信息成功',
			data:arr
		})
	})
}
// 删除订单信息
exports.del_order = (req,res) =>{
	const sql = "delete from `order` where id = ? and username = ?"
	db.query(sql,[req.body.id,req.user.username],(err,results)=>{
		if(err) res.mt(err)
		if(results.affectedRows!==1) return res.mt('删除失败，或者没有此订单')
		res.send({
			status:0,
			message:'删除成功'
		})
	})
}
// 生成未处理订单
exports.add_order = (req,res) =>{
	const timeout = Date.parse(new Date().toString())/1000
	const order = {
		'username':req.user.username,
		'blurb':req.body.blurb,
		'money':Number(req.body.money),
		'time':timeout
	}
	const sql = "insert into `order` set ?"
	db.query(sql,order,(err,results)=>{
		if(err) res.mt(err)
	    if(results.affectedRows !==1) return res.mt  ('生成订单失败')
		res.send({
			status:0,
			message:'生成订单成功',
			data:results.insertId
		})
	})
}
// 支付成功修改订单状态为待处理
exports.pay_order = (req,res) =>{
	const username = req.user.username
	// 订单id
	const id = req.body.id
	// 优惠卷创建时间
	const create_time = req.body.create_time
	// 更新的订单信息
	const new_order = {
		status:1,
		courier:req.body.courier,
		site:req.body.site,
		note:req.body.note,
		name:req.body.name,
		tel:req.body.tel,
		money:req.body.balance,
		coupon:req.body.coupon,
	}
	// 查询余额
	const select_sql = `select residual from user where username = ?`
	db.query(select_sql,username,(err,results)=>{
		if(err) return res.mt(err)
		if(results.length!==1) return res.mt('获取余额失败')
		let balance = results[0].residual
		balance = balance - req.body.balance
		if(balance<0) return res.mt('余额不足!')
		// 判断是否使用优惠卷并删除使用的优惠卷(需要修改，将时间戳修改为id)
		const coupon_sql = `update kfc_receive set status = 1 where create_time = ?`
		if(create_time && create_time.length === 13 && create_time>0){
		db.query(coupon_sql,create_time,(err,result)=>{
			if(err) return res.mt(err)
			if(result.affectedRows !== 1) res.mt('优惠卷使用失败!')
		})
	}
		// 修改余额
		const money_sql = `update user set residual = ? where username = ?`
		db.query(money_sql,[balance,username],(req,result)=>{
			if(err) return res.mt(err)
			if(result.affectedRows!==1) res.mt('支付失败')
			// 修改订单状态
			const order_sql = "update `order` set ? where id = ?"
			db.query(order_sql,[new_order,id],(err,results)=>{005
				if(err) return res.mt(err)
				if(results.affectedRows!==1) return res.mt('订单提交失败')
				res.send({
					status:0,
					message:'提交成功待处理！'
				})
			})
		})
	})
}