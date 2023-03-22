const multer = require('multer')
const fs = require('fs');
const { ORDER } = require('mysql/lib/PoolSelector');
const db = require('../db/index')
const { binary } = require('joi');
const { channel } = require('diagnostics_channel');

// 分类新增
exports.add_classify = (req,res)=>{
	const change = req.body
	const sql = `insert into all_classify set ?`
	db.query(sql,change,(err,result)=>{
		if(err) return res.mt(err)
		if(result.affectedRows!==1) return res.mt('添加失败')
		res.send({
			status:0,
			message:'成功'
		})
	})
}
// 分类删除
exports.del_classify = (req,res)=>{
	const id = req.body.id
	const sql = `delete from all_classify where id = ?`
	db.query(sql,id,(err,result)=>{
		if(err) return res.mt(err)
		if(result.affectedRows!==1) return res.mt('添加失败')
		res.send({
			status:0,
			message:'成功'
		})
	})
}

// 编辑小分类
exports.The_small_classification = (req,res)=>{
	const change = req.body
	const sql = 'update all_classify set ? where id = ?'
	db.query(sql,[change,change.id],(err,result)=>{
		if(err) return res.mt(err)
		if(result.affectedRows!==1) return res.mt('修改失败')
		res.send({
			status:0,
			message:'修改成功',
		})
	})
}

// 新增商品
exports.add_goods = (req, res) => {
	const sql_select = 'select goods_name from blurb where goods_name = ?'
	console.log(req.body);
	db.query(sql_select,req.body.goods_name,(err,results)=>{
		if(err) return res.mt(err)
		if(results.length>0) return res.mt('已有相同商品')
		const sql_insert = 'insert into blurb set ?'
		db.query(sql_insert,req.body,(err,result)=>{
			if(err) return res.mt(err)
			if(result.affectedRows!==1) return res.mt('添加失败')
			res.send({
				status:0,
				message:'新增成功'
			})
		})
	})
}
// 编辑商品
exports.edit_goods =(req,res)=>{
	if(req.body.goods_image.indexOf('uploads')!=-1){
		const goods_image = req.body.goods_image.substring(req.body.goods_image.lastIndexOf('/'))
		const read_path = './static/uploads'+goods_image
		let group = new Map([
			['电子类','./static/goodsImage_electronic'],
			['服装类','./static/goodsImage_clothing'],
			['家具类','./static/goodsImage_daily'],
			['日用类','./static/goodsImage_suite'],
		])
		const up_path = group.get(req.body.goods_type) + goods_image;
		const imgBuffer = fs.readFileSync(read_path)
		fs.writeFileSync(up_path,imgBuffer)
		const img_path = 'https://server.yoyocat.xyz/api'+up_path.substring(up_path.lastIndexOf('/',up_path.lastIndexOf('/')-1))
		req.body.goods_image = img_path
	}
	let {id,...change} = req.body
	const sql = 'update blurb set ? where id = ?'
	db.query(sql,[change,req.body.id],(err,result)=>{
		if(err) return res.mt(err)
		if(result.affectedRows!==1) return res.mt('修改失败')
		res.send({
			status:0,
			message:'编辑成功'
		})
	})
}
// 下架商品
exports.downGoods = (req,res)=>{
	let change = req.body
	const del_sql = 'delete from blurb where id = ?'
	db.query(del_sql,change.id,(err,result)=>{
		if(err) return res.mt(err)
		if(result.affectedRows!==1) return res.mt('删除失败')
		let {id,...data} = change
		const insert_sql = 'insert into UnShelve set ?'
		db.query(insert_sql,data,(err,results)=>{
			if(err) return res.mt(err)
			if(results.affectedRows!==1) return res.mt('下架商品转移失败')
			res.send({
				status:0,
				message:'下架成功',
			})
		})
	})
}
// 上架商品
exports.upGoods = (req,res)=>{
	console.log(req.body);
}
// 上架已下架商品
exports.up_down_goods = (req,res)=>{
	console.log(req.body.id);
	const id = req.body.id
	const sql_sel = 'select * from UnShelve where id = ?'
	db.query(sql_sel,id,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length<=0) return res.mt('查询下架商品失败')
		const {id,...blurb_info} = result[0]
		console.log(blurb_info);
		const sql_insert = 'insert into blurb set ?'
		const sql_del = 'delete from UnShelve where id = ?'
		db.query(sql_insert,blurb_info,(err,results)=>{
			if(err) return res.mt(err)
			if(results.affectedRows!==1) return res.mt('上架商品失败')
			res.send({
				status:0,
				message:'上架成功',
			})
		})
		db.query(sql_del,id,(err,results)=>{
			if(err) return res.mt(err)
			if(results.affectedRows!==1) return res.mt('删除下架商品失败')
		})
	})
}
// 获取下架商品
exports.get_up_goods = (req,res)=>{
	const sql = 'select *from UnShelve'
	db.query(sql,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length<0) return res.mt('错误，联系管理员')
		if(result.length === 0) return res.mt('没有数据')
		res.send({
			status:0,
			message:'获取成功',
			data:result
		})
	})
}
// 添加图片
exports.upload_imgs = async (req, res) => {
	try {
	        const avatar = req.file;
	        if (!avatar) {
	            res.mt('No file is selected.');
	        } else {
	            res.send({
	                status: true,
	                message: 'File is uploaded.',
	                data: {
	                    avatar
	                }
	            });
	        }
	
	    } catch (err) {
	        res.mt(err)
	    }
}
// 获取管理员信息
exports.manager_info = (req, res) => {
	console.log(req.user);
	const sql = `select username,nickname,img_url,level from admin where id = ?`
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
// 获取用户信息
exports.userInfo = (req,res)=>{
	const sql = 'select nickname,img_url,username,vip,residual from user'
	db.query(sql,(err,result)=>{
		if(err) return res.mt(err)
		if(result.length<=0) return res.mt('获取信息失败')
		console.log(1);
		res.send({
			status:0,
			message:'获取用户表成功',
			data:result
		})
	})
}
// 获取表数量
exports.meter_num = (req,res)=>{
	const sql = `select count(*) from ${req.body.table_name}`
	db.query(sql,(err,result)=>{
		if(err) return res.mt(err)
		res.send({
			status:0,
			message:'获取数据成功',
			data:Object.values(result[0])[0]
		})
	})
}
// 获取订单记录
exports.time_order = (req,res) =>{
	// if(req.body.length<=0) {
	// 	const timer = 0
	// }else{
		const timer = Number(req.body.timeout)
	// }
	const sql = "select *from `order` where `time`>?"
	db.query(sql, timer, (err, result) => {
		if (err) return res.mt(err)
		let money = 0
		let num = 0
		result.forEach(item=>{
			money+=item.money
			num+=1
		})
		res.send({
			status: 0,
			message: '获取订单信息成功',
			num:num,
			all_money:money,
			data: result
		})
	})
}
// 获取热搜词
exports.hot_word = (req,res)=>{
	const sql = `select hotterm,num from hotWord order by num desc limit ${req.body.num}`
	db.query(sql,(err,result)=>{
		const hot = result
		if(err) res.mt(err)
		if(result.length<=0) res.mt('获取失败')
		res.send({
			status:0,
			message:'获取成功',
			data:hot
		})
	})
}
