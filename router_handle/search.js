const { Result } = require('express-validator')
const db = require('../db/index')
// 获取所有分类信息
exports.search_classify = (req,res)=>{
	const sql = `select * from all_classify`
	db.query(sql,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length <=0) return res.mt('获取失败或暂无分类')
		res.send({
			status:0,
			message:'获取所有分类成功',
			data:result
		})
	})
}
// 商品名称搜索商品
exports.search_goods = (req,res) =>{
	const sql = `select * from blurb where goods_name like"%${req.body.search_goods}%" `
	db.query(sql,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length <=0) return res.mt('没有要查询的商品')
		res.send({
			status:0,
			message:'搜索商品信息成功',
			data:result
		})
	})
}
// 商品id获取商品信息
exports.search_goods_id = (req,res) =>{
	const shop_id = req.body.shop_id
	const sql = `select * from blurb where id=?`
	db.query(sql,shop_id,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length <=0) return res.mt('没有要查询的商品')
		res.send({
			status:0,
			message:'搜索商品信息成功',
			data:result[0]
		})
	})
}
// 获取指定类别商品
exports.search_classifyGoods= (req,res) =>{
	const sql = `select * from blurb where goods_category = ?`
	db.query(sql,req.body.goods_category,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length<=0) return res.mt('暂时没有此类商品')
		res.send({
			status:0,
			message:'获取商品信息成功',
			data:result
		})
	})
}