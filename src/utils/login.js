import Taro from '@tarojs/taro'
import AV from 'leancloud-storage/dist/av-weapp.js'
import { WEAPP_ID, WEAPP_KEY } from './constant'

export const wechatLogin = async () => {
  try {
    const { code } = await Taro.login()
    const res = await AV.Cloud.run('code2Session', {
      appid: WEAPP_ID,
      secret: WEAPP_KEY,
      js_code: code
    })
    // const user = await AV.User.loginWithAuthData({
    //   openid,
    //   access_token,
    //   expires_in: 7200
    // }, 'wechat')
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const requestSMSCode = async number => {
  try {
    const res = await AV.User.requestLoginSmsCode(number)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const smsLogin = async (number, code) => {
  try {
    const user = await AV.User.logInWithMobilePhoneSmsCode(number, code)
    return Promise.resolve(user.toJSON())
  } catch (error) {
    return Promise.reject(error)
  }
}