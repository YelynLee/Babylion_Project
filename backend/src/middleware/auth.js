//authentication 과정이 잘 되었는지 재확인 과정 route
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let auth = async (req, res, next) => {
    //토큰을 request headers에서 가져오기
    const authHeader = req.headers['authorization'];

    //headers: Bearer dafsladsfaf.adsfasfaf.dsfadfaff
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401); //헤더 자체가 없으면 token은 undefined이므로 null이 아닌 falsy 체크로 수정

    try {
        //토큰이 유효한지 확인
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        //해당 토큰의 유저가 존재하는지
        const user = await User.findOne({"_id": decode.userId});
        if(!user) {
            return res.status(400).send('없는 유저입니다.');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = auth;