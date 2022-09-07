const { Result } = require('express-validator')
const db= require('../db/index')
// 获取商品轮播图
exports.carousel_img = (req,res)=>{
	const sql = `select *from carousel_info`
	db.query(sql,(err,results)=>{
		if(err) return res.mt(err)
		if(results.length<=0) return res.mt('暂无图片,等待上传')
		res.send({
			status:0,
			message:'获取轮播图片成功',
			data:results
		})
	})
}
// 获取畅销商品信息
exports.goods_img = (req,res)=>{
	const sql = `
	select *from blurb ORDER BY goods_sold desc LIMIT 20`
	db.query(sql,(err,results)=>{
		if(err) return res.mt(err)
		if(results.length<=0) return res.mt('暂无图片,等待上传')
		res.send({
			status:0,
			message:'获取商品信息成功',
			data:results
		})
	})
}
// 强推商品信息
exports.goods_vip = (req,res)=>{
	const sql = `select *from blurb where goods_vip = 1`
	db.query(sql,(err,results)=>{
		if(err) return res.mt(err)
		if(results.length<=0) return res.mt('本周无主打商品')
		res.send({
			status:0,
			message:'获取商品信息成功',
			data:results
		});
	})
}