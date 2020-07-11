import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './launcher.scss'

import { initLeanCloud } from '../../utils/init'
import { isLoggedIn } from '../../utils/login'

export default class Launcher extends Component {
  componentWillMount() {}

  componentDidMount() {
    initLeanCloud()

    // check login status
    const loggedIn = isLoggedIn()
    Taro.reLaunch({
      url: loggedIn ? '../index/index' : '../login/login'
    })
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='page launcher'>
        <View className='group'>
          <Image className='logo' src={require('../../assets/logo.png')} />
        </View>
      </View>
    )
  }
}
