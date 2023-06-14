import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../../../Cookies/Cookies';

export const openviduapi = axios.create({
  baseURL: process.env.REACT_APP_APPLICATION_SERVER_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

// HTTP 요청 가로채기
// 요청은 AccessToken과 RefreshToken 담아서
openviduapi.interceptors.request.use(
  // 요청을 보내기 전에 수행할 작업
  (config) => {
    console.log('OPENVIDU REQUEST SUCCESS===> ', config);
    const accessToken = getCookie('AccessToken');
    const refreshToken = getCookie('RefreshToken');

    // 토큰이 존재하는 경우에만 헤더스에 추가
    if (accessToken && refreshToken) {
      config.headers['Access_Token'] = `Bearer ${accessToken}`;
      config.headers['Authorization'] = 'Basic T1BFTlZJRFVBUFA6U1RVRFlIVUI';
    }
    return config;
  },

  // 오류 요청을 보내기 전 수행되는 함수
  (error) => {
    console.log('인터셉터 요청 오류');
    console.log('OPENVIDU REQUEST ERROR=======> ', error);
    return Promise.reject(error);
  }
);

//HTTP 응답 가로채기
openviduapi.interceptors.response.use(
  // 응답을 보내기 전 수행되는 함수
  (config) => {
    console.log('OPENVIDU RESPONSE SUCCESS======> ', config);
    return config;
  },

  // 오류 응답을 보내기 전 수행되는 함수
  async (error) => {
    console.log('인터셉터 응답 오류');
    console.log('OPENVIDU RESPONSE ERROR=======> ', error);

    const {
      config,
      response: { status, data },
    } = error;

    const originalRequest = config;
    const refreshToken = getCookie('RefreshToken');
    console.log('RESPONSE MESSAGE', status);

    if (status === 403 && data === 'Access Token Expired') {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/members/refresh-token`,
          {
            headers: {
              Refresh_Token: `Bearer ${refreshToken}`,
            },
          }
        );
        const newAccessToken = data.data.split(' ')[1];
        setCookie('AccessToken', newAccessToken, { path: '/' });
        originalRequest.headers['Access_Token'] = `Bearer ${newAccessToken}`;
        return await axios(originalRequest);
      } catch (error) {
        console.log('response error:', error);

        const {
          response: {
            status,
            data: { message },
          },
        } = error;

        if (status === 403 && message === 'Refresh Token Expired') {
          alert('로그인 후 다시 시도해주세요!');
          removeCookie('AccessToken', { path: '/' });
          removeCookie('RefreshToken', { path: '/' });
          window.location.href = '/members/login';
        }
      }
    }
    return Promise.reject(error);
  }
);