//backend src folder의 index.js에서 user에 관련한 요청 처리는 따로 빼와서 해당 file에서 다룸!
/*frontend의 thunkFunctions.js에서
    async (body, thunkAPI) => {
    try {
        const response = await axiosInstance.post(
            `/users/register`, //해당 backend API로 요청(post)
            body
        )
에 대응한 소스 코드*/

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/register', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save(); //user.save().then(()).catch()도 가능!
        return res.sendStatus(200);
    }
    catch (error) {
        next(error) //에러 처리기로 error를 전달
    }
});

router.post('/login', async (req, res, next) => { //async 누락 + catch 누락으로 SyntaxError가 나던 부분 수정
    //req.body = email, password
    try {

        //해당 email의 user가 server's user collection에 있는지 확인
        const user = await User.findOne({ email: req.body.email }); //user collection에서 찾기

        if(!user) {
            return res.status(400).send("Auth failed, email not found");
        }

        //해당 user의 password가 올바른지
        const isMatch = await user.comparePassword(req.body.password); //User.js에 선언된 comparePassword() 사용
        //req.body.password = plainPassword, isMatch에는 true or false 값이 들어옴

        if(!isMatch) {
            return res.status(400).send('Wrong password');
        }

        //email과 해당 password까지 모두 일치하면 token을 생성
        const payload = {
            userId: user._id.toHexString(), //DB의 id는 object이므로 string으로 변환
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        return res.json({ user, accessToken }) //Client에 전송, userSlice.js의 action.payload로 넣음
    }
    catch (error) {
        next(error) //에러 처리기로 error를 전달
    }
});

router.post('/logout', (req, res) => {
    //JWT는 stateless라서 서버에 별도로 지워야 할 세션이 없음(토큰은 frontend의 localStorage에서 삭제됨, thunkFunctions.js 참고)
    //추후 refresh token/토큰 블랙리스트 등 서버 측 상태를 도입하면 이 라우트에서 실제 무효화 처리를 추가하면 됨
    //지금은 frontend가 기대하는 엔드포인트를 제공해 로그아웃 요청 흐름을 완결시키는 역할
    return res.sendStatus(200);
});

router.get('/auth', auth, async (req, res) => { //auth(.js)라는 middleware를 넣고, 이로부터 req.user 값을 받음
   return res.json({ //인증이 재확인된 user data를 client에 재전송
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
   })
});

module.exports = router; //index.js에서 다시 이 router를 가져오기 위함