# Babylion Project

JWT 기반 회원가입/로그인 인증을 다루는 학습용 MERN 스택 프로젝트입니다.

## 기술 스택

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: React, Vite, Redux Toolkit (+ redux-persist), React Router, Tailwind CSS, axios

## 폴더 구조

```
backend/
  src/
    index.js            # 서버 진입점 (express 설정, cors, mongoose 연결)
    middleware/auth.js   # JWT 검증 미들웨어
    models/User.js       # Mongoose User 스키마 + 비밀번호 해싱
    routes/users.js      # /users/register, /users/login, /users/logout, /users/auth
    seed/seedUsers.js    # 데모 계정 시드 스크립트
  uploads/
    avatars/              # 데모 계정 프로필 이미지 (정적 서빙됨)

frontend/
  src/
    App.jsx               # 라우팅
    store/                # Redux Toolkit (userSlice, thunkFunctions)
    utils/axios.js         # axios 인스턴스 (baseURL + JWT 헤더 자동 첨부)
    components/            # ProtectedRoutes / NotAuthRoutes (라우트 가드)
    pages/, layout/         # 페이지 & 레이아웃 컴포넌트
```

## 인증 흐름

1. `POST /users/register` — 회원가입 (비밀번호는 저장 전 자동 해싱됨)
2. `POST /users/login` — 로그인, 성공 시 JWT(`accessToken`) 발급
3. 프론트가 `accessToken`을 `localStorage`에 저장하고, 이후 모든 요청에 axios 인터셉터가
   `Authorization: Bearer <token>` 헤더를 자동으로 붙임
4. `GET /users/auth` — 토큰 검증 + 로그인 상태 재확인 (`ProtectedRoutes` / `NotAuthRoutes`가 이 상태로 라우트 접근을 제어)
5. `POST /users/logout` — 로그아웃(현재는 stateless JWT라 서버에 지울 세션이 없어 확인 응답만 반환. 토큰 삭제는 프론트에서 처리)

## 로컬 실행 방법

### 1. 환경변수 설정

```bash
cd backend
cp .env.example .env
# .env를 열어 MONGO_URI, JWT_SECRET 값을 채워주세요
```

### 2. 백엔드 실행

```bash
cd backend
npm install
npm run dev        # http://localhost:4000
```

### 3. (선택) 데모 계정 생성

```bash
cd backend
npm run seed        # backend/uploads/avatars/의 이미지를 사용하는 데모 계정 4개 생성
```

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

기본적으로 백엔드는 `FRONTEND_URL`(기본값 `http://localhost:5173`)만 CORS로 허용합니다.
Postman 등 브라우저가 아닌 클라이언트는 CORS 정책의 영향을 받지 않으므로, 개발 초기에
Postman으로 API를 테스트했다면 프론트에서 직접 호출할 때는 이 origin 설정이 실제
프론트 주소와 일치하는지 꼭 확인하세요.

## 알려진 한계 / TODO

- 이미지 업로드(회원가입/프로필 수정 시 실제 파일 업로드)는 아직 구현되어 있지 않습니다.
  `User.image`와 `uploads/` 정적 서빙은 준비되어 있으므로, 추후 `multer` 등으로 업로드
  라우트를 추가하면 됩니다.
- 자동화된 테스트가 없습니다. 최소한 `register` / `login` / `auth` 라우트에 대한 통합
  테스트(Jest + supertest 등)를 추가하는 것을 권장합니다.
- 로그아웃은 클라이언트 측 토큰 삭제에 의존하는 단순 stateless 구현입니다. 토큰 만료
  전 강제 무효화가 필요하다면 refresh token / 토큰 블랙리스트 도입을 고려하세요.
