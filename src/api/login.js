import request from '@/utils/request'

export const userApi = {
  Login: '/auth/sys/auth/api/login',
  Logout: '/auth/sys/auth/api/logout',
  Register: '/register',
  UserInfo: '/auth/sys/auth/api/userInfo',
  Captcha: '/auth/sys/auth/api/captcha'
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

// 注册方法
export function register (data) {
  return request({
    url: userApi.Register,
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
