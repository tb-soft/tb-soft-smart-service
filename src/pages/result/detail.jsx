import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './result.scss'

import ResultDetail from './component/ResultDetail'

export default class Detail extends Component {

  state = {
    query: null,
    result: null
  }

  componentWillMount () { 
    const { data } = this.$router.params
    const { query, result } = JSON.parse(data)
    this.setState({
      query,
      result
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '查询详情'
  }

  render () {
    const { query, result } = this.state
    if (!result) {
      return null
    }

    return (
      <View className='page result'>
        <ResultDetail
          query={query} 
          data={result}
        />
      </View>
    )
  }
}
