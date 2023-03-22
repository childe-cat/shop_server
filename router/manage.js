const express = require("express");
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
	destination:function(req,res,cb){
		cb(null,'./static/uploads')
	},
	filename: function(req, file, cb) {
	        // 设置文件名
	        let fileData = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
	        cb(null, file.fieldname + "-" + fileData)
	    }
	})
const upload = multer({
	storage:storage
})
const router = express.Router()

// 引入路由配置模块
const admin =require('../router_handle/manage')
// 获取管理员信息
router.get('/managerInfo',admin.manager_info)
// 获取所有用户信息
router.get('/userInfo',admin.userInfo)
// 获取表行
router.post('/meter_num',admin.meter_num)
// 分类新增
router.post('/add_classify',admin.add_classify)
// 分类删除
router.post('/del_classify',admin.del_classify)
// 修改小分类
router.post('/The_small_classification',admin.The_small_classification)
// 添加商品
router.post('/add_goods',admin.add_goods)
// 修改商品
router.post('/edit_goods',admin.edit_goods)
// 下架商品
router.post('./up_goods',admin.upGoods)
// 获取下架商品
router.get('/get_up_goods',admin.get_up_goods)
// 上架新商品
router.post('/down_goods',admin.downGoods)
// 上架已下架商品
router.post('/up_down_goods',admin.up_down_goods)
// 添加图片
router.post('/upload_imgs',upload.single('file'),admin.upload_imgs)
// 获取订单记录
router.post('/time_order',admin.time_order)
// 获取热搜词
router.post('/hot_word',admin.hot_word)

module.exports = router