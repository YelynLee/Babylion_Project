import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ?
        '': 'http://localhost:4000' //좌측은 배포한 이후의 baseURL(중복되는 URI)를 배치
});

axiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('accessToken');
    if (token) { //토큰이 있을 때만 헤더를 붙임 ('Bearer' + token처럼 공백 누락 시 서버의 split(' ')이 실패했음)
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
})

export default axiosInstance;