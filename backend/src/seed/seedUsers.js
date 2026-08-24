// 데모/테스트용 계정을 DB에 생성하는 시드 스크립트
// 실행: cd backend && npm run seed
//
// frontend/ 루트에 흩어져 있던 팀 프로필 사진(마티유.jpg, 배윤영.jpg, 임세아.jpg, 페라가모.jpg)을
// backend/uploads/avatars/ 로 옮기고(파일명은 URL-safe하도록 로마자로 변경),
// 각 데모 계정의 User.image 필드가 해당 이미지를 가리키도록 연결한다.
// index.js가 uploads/를 정적 서빙하므로, image 값은 서버 기준 '/avatars/파일명.jpg' 경로로 접근 가능하다.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const demoUsers = [
    { name: 'Matthieu', email: 'matthieu@example.com', password: 'password123', image: '/avatars/matthieu.jpg' },
    { name: '배윤영', email: 'baeyunyoung@example.com', password: 'password123', image: '/avatars/baeyunyoung.jpg' },
    { name: '임세아', email: 'imsea@example.com', password: 'password123', image: '/avatars/imsea.jpg' },
    { name: 'Ferragamo', email: 'ferragamo@example.com', password: 'password123', image: '/avatars/ferragamo.jpg' },
];

async function seed() {
    if (!process.env.MONGO_URI) {
        throw new Error('.env에 MONGO_URI가 설정되어 있지 않습니다. backend/.env.example을 참고해 backend/.env를 만들어주세요.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB 연결 완료 (seed)');

    for (const data of demoUsers) {
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            console.log(`이미 존재함, 건너뜀: ${data.email}`);
            continue;
        }
        const user = new User(data); //User.js의 pre('save') 훅에서 비밀번호가 자동으로 해싱됨
        await user.save();
        console.log(`생성됨: ${data.email}`);
    }

    await mongoose.disconnect();
    console.log('시드 완료');
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
