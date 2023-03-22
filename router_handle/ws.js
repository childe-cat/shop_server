const express = require('express')
const expressWs = require('express-ws')
// 链接数据库
const db = require('../db/index')

const router = express.Router()
expressWs(router)

let conArr = []
// 打开ws链接
router.ws('/user',(ws,req)=>{
	conArr.push(ws)
	console.log(conArr);
	ws.on('message',(msg)=>{
		console.log(msg);
		for(let i = 0;i<conArr.length;i++){
			conArr[i].send(msg)
		}
		// 将聊天记录插入数据库
			console.log(req.body);
			const sql = 'insert into chat_list set ?'
	})
})
// 获取聊天信息
router.post('/chat',(req,res)=>{
	const from_user = req.user.username
	const to_user = 'l-test@qq.com'
	const sql = "SELECT * FROM chat_list WHERE from_user = ? OR to_user = ?"
	let arr = []
	db.query(sql,[req.user.username,to_user],(err,result)=>{
		if(err) return res.mt(err)
		if(result.length<0) return res.mt('获取失败')
		db.query(sql,[to_user,req.user.username],(err,results)=>{
			if(err) return res.mt(err)
			if(result.length<0) return res.mt('获取失败')
			arr = [...result,...results]
			res.send({
				status:0,
				message:'获取聊天信息成功',
				data:arr
			})
		})
	})
})

module.exports = router