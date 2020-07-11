import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Icon, Input, Button } from '@tarojs/components'
import './index.scss'

import Floater from '../../components/Floater'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '自助查询'
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    Taro.hideHomeButton()
  }

  componentDidHide() {}

  onConfirm = ({ detail: { value } }) => {
    if (!value.trim()) return
    Taro.navigateTo({
      url: `../result/result?query_string=${value}`
    })
  }

  onAddPress = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../dataform/dataform'
    })
  }

  render() {
    return (
      <View className='page index'>
        <View className='group'>
          <Image className='logo' src={require('../../assets/logo.png')} />
          <View className='input-container'>
            <Icon
              className='search_icon'
              size='16'
              type='search'
              color='#9AA0A6'
            />
            <Input
              adjustPosition
              className='input'
              placeholderClass='input-placeholder'
              placeholder='请输入故障原因 / 处理方案'
              confirmType='search'
              onConfirm={this.onConfirm}
            />
          </View>
          {/* <View className='copyright-container'>
            <Text className='copyright-text'>© 2020 九桥同步</Text>
          </View> */}
          <Floater
            image={require('../../assets/add.png')}
            onClick={this.onAddPress}
          />
        </View>
      </View>
    )
  }
}
