const {check} = require("express-validator");
exports.register_verify = [
    check('username','用户名不符合要求')
        .isLength({min:6,max:18}),
    check('password','密码不符合要求')
        .isLength({min:8,max:16})
        //至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/)
]
exports.revise_verify = [
    check('password','密码不符合要求')
        .isLength({min:8,max:16})
        //至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/)
]