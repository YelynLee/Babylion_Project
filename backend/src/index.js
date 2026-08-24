const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 4000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', //백엔드 자기 포트가 아니라 프론트(Vite) 주소를 허용해야 브라우저 요청이 통과됨
    credentials: true,
};

app.use(cors(corsOptions)); //서로 다른 origin이더라도 통신 가능하도록 cors()를 middleware로 등록
app.use(express.json());

mongoose.connect(process.env.MONGO_URI) //URI에 user name과 password가 모두 나타나므로 env로 숨김
    .then(() => {
        console.log('연결 완료');
    })
    .catch(err => {
        console.error(err);
    });

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/', (req,res) => {
    console.log(req.body); //req.body의 데이터를 얻으려면 express.json()을 middleware로 등록
    res.json(req.body);
});

app.use('/users', require('./routes/users')); //users.js에 따로 빼둔 route 가져오기

app.use(express.static(path.join(__dirname, '../uploads')));
//express app의 'uploads' folder에 있는 정적 file(이미지)들을 middleware로 등록
//app.use('/경로', express.static('uploads'))과 같이 특정 경로를 설정해서 보이도록 제한할 수도 있음
//그러나 "uploads"와 같은 상대 경로를 사용하면, fullstack-app에서 실행할 때엔 이미지가 보이지 않음
//--> 따라서 절대 경로 사용 by "path.join(__dirname, ~)"...
//'..uploads'에서 점 2개는 현 위치에서 빠져나오기(즉, /src의 위치가 아님)

app.use((error, req, res, next) => {
    res.status(error.status || 500); //express app 자체에서 err or server에서 err
    res.send(error.message || '서버에서 에러가 났습니다.');
}) //에러 처리기(오류가 있다고 해서 서버가 crash/down되지 않도록 함. 단순히 message만 띄움)
//에러 핸들러(4개 인자 미들웨어)는 다른 모든 라우트/미들웨어 등록 이후, 맨 마지막에 와야 그 이전 단계에서 난 에러를 모두 잡을 수 있음

app.listen(port, () => {
    console.log(`${port}번에서 실행되었습니다.`);
});