import axios from 'axios';
import store from '@/store';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

// create an axios instance
const service = axios.create({
  baseURL: '/api', // dev-api, prod-api, test-api; url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
});
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['Authentation'] = localStorage.getItem('Authentation') || '123'
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.resultCode !== 0) {
      // 401 Illegal token, Other clients logged in,Token expired;
      if (res.code === 401) {
        // to re-login
        // vant.Toast(res.resultMessage);
      }
      return Promise.reject(new Error(res.resultMessage || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.log('err=> ' + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
