//导入数据库操作模块
const db = require('../db/index')
//引入bcryptjs加密中间件
const bcrypt = require('bcryptjs')
//引入token生成包
const jwt = require('jsonwebtoken')
//导入配置文件
const config = require('../configure')
//验证规则
const {validationResult} = require("express-validator");

//注册
exports.regUser = (req,res)=>{
    //验证失败报错
    let err = validationResult(req);
    if(!err.isEmpty()) return res.mt(err.mapped())
    const userinfo = req.body
    const selectSql = `select * from user where username=?`
    db.query(selectSql,userinfo.username,(err,results)=>{
        if(err){
            return res.mt(err)
        }
        if(results.length>0){
            return res.mt('用户名被占用，请更换其他用户名')
        }
        //加盐加密
        userinfo.password = bcrypt.hashSync(userinfo.password,10)
        //查询为空不重复
        const insertSql = `insert into user set ?`
        db.query(insertSql,{username:userinfo.username,password:userinfo.password},(err,results)=>{
            if(err) return res.mt(err)
            if(results.affectedRows !==1) return res.mt('注册失败，请稍后再试')
            res.send('注册成功')
        })
    })
}
//登录
exports.login = (req,res)=>{
    let err = validationResult(req);
    if(!err.isEmpty()) return res.mt(err.mapped())
    const userinfo = req.body
    const selectSql = `select *from user where username=?`
    db.query(selectSql,userinfo.username,(err,results)=>{
        if(err) return res.mt(err)
        if(results.length!==1) return res.mt('登陆失败，查无此人!')
        //比对数据库密码
        const flag = bcrypt.compareSync(userinfo.password,results[0].password)
        if(!flag) return res.mt('登陆失败，密码错误!')
        const user = {...results[0],password:'',residual:''}
		// 生成token
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{
            expiresIn:'2h'
        })
        res.send({
            status:0,
            message:'登陆成功！',
            token:'Bearer ' + tokenStr
        })
    })
}