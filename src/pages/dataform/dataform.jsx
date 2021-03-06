import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Text,
  Input,
  Picker,
  Radio,
  RadioGroup,
  Textarea,
  Button
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtNoticebar } from 'taro-ui'
import dayjs from 'dayjs'
import './dataform.scss'

import { constructReportObjectToWrite } from '../../utils/leancloud'

const radio_color = 'rgb(186, 44, 40)'

@connect(({ user, loading }) => ({
  currentUser: user.current,
  temp: user.temp,
  creating: loading.effects['report/create'],
  updating: loading.effects['report/update']
}))
export default class DataForm extends Component {
  state = {
    last_edit_at: null,
    data: {}
  }

  componentWillMount() {}

  componentDidMount() {
    const { id } = this.$router.params
    if (id) {
      Taro.setNavigationBarTitle({ title: '更新记录' })
      this.queryItem()
      this.updateObject = constructReportObjectToWrite(id)
    } else {
      Taro.setNavigationBarTitle({ title: '添加记录' })
      this.getTempData()
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  queryItem = () => {
    const { id } = this.$router.params
    Taro.showNavigationBarLoading()
    this.props.dispatch({
      type: 'report/get',
      id,
      callback: data => {
        this.setState({
          data
        })
      },
      complete: () => {
        Taro.hideNavigationBarLoading()
      }
    })
  }

  onFormSubmit = e => {
    e.stopPropagation()
    const { id } = this.$router.params
    if (id) {
      this.updateReport()
    } else {
      const { data } = this.state
      if (
        !data.error_detail &&
        !data.ora_error_detail &&
        !data.error_cause_detail &&
        !data.solution_detail
      ) {
        Taro.showToast({
          title: '请填写报错信息/解决方案',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!data.software_version) {
        data.software_version = '所有版本'
      }
      // add technician
      const { username } = this.props.currentUser
      data.technican = username

      // save it
      this.saveReport(data)
    }
  }

  updateReport = () => {
    this.props.dispatch({
      type: 'report/update',
      object: this.updateObject,
      callback: () => {
        Taro.navigateBack()
        Taro.showToast({
          title: '已更新',
          icon: 'success'
        })
      }
    })
  }

  saveReport = value => {
    this.props.dispatch({
      type: 'report/create',
      payload: value,
      callback: result => {
        Taro.redirectTo({
          url: `../index/result/detail?id=${result.objectId}`
        })
        Taro.showToast({
          title: '已创建',
          icon: 'success'
        })
        this.removeTempData()
      }
    })
  }

  // onDeleteClick = item => async e => {
  //   e.stopPropagation()
  //   try {
  //     const { confirm } = await Taro.showModal({
  //       title: '提示',
  //       content: `确认删除「${item.name}」吗？`,
  //       confirmText: '删除',
  //       confirmColor: '#BA2C28'
  //     })
  //     if (confirm) {
  //       this.deleteFile(item.objectId)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // deleteFile = async id => {
  //   const file = buildDocumentToDelete(id)
  //   try {
  //     Taro.showLoading({ title: '正在删除...' })
  //     await file.destroy()
  //     this.setState(({ upload_files }) => ({
  //       upload_files: upload_files.filter(f => f.objectId !== id)
  //     }))
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     Taro.hideLoading()
  //   }
  // }

  onFieldInput = key => ({ detail: { value } }) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          [key]: value
        }
      },
      () => {
        const { id } = this.$router.params
        if (id) {
          this.updateObject.set(key, value)
        } else {
          this.setTempData()
        }
      }
    )
  }

  onNoticeClick = e => {
    e.stopPropagation()
    this.setState(
      {
        data: this.tempform
      },
      () => {
        this.noticeBar.state.show = false
        this.noticeBar.forceUpdate()
      }
    )
  }

  setTempData = () => {
    const { data } = this.state
    this.props.dispatch({
      type: 'user/saveTemp',
      payload: {
        last_edit_at: dayjs().format('lll'),
        data
      }
    })
  }

  getTempData = () => {
    const { temp } = this.props
    if (temp) {
      const { last_edit_at, data } = temp
      this.tempform = data
      this.setState({
        last_edit_at
      })
    }
  }

  removeTempData = () => {
    this.props.dispatch({
      type: 'user/removeTemp'
    })
  }

  render() {
    const { creating, updating } = this.props
    const {
      last_edit_at,
      data: {
        client_name,
        serviced_at,
        software_version,
        software_state,
        software_type,
        error_detail,
        ora_error_detail,
        error_cause_detail,
        solution_detail
      }
    } = this.state
    return (
      <View>
        {!!last_edit_at && (
          <AtNoticebar
            ref={ref => {
              this.noticeBar = ref
            }}
            close
            single
            showMore
            moreText='继续编辑'
            onGotoMore={this.onNoticeClick}
          >
            上次编辑于 {last_edit_at}
          </AtNoticebar>
        )}
        <View className='page data-form'>
          <View className='item-container'>
            <Text className='item-title'>客户名称：</Text>
            <View className='input-container'>
              <Input
                value={client_name}
                adjustPosition
                className='input'
                placeholderClass='input-placeholder'
                placeholder='请输入客户名称'
                onInput={this.onFieldInput('client_name')}
              />
            </View>
          </View>
          <View className='item-container'>
            <Text className='item-title'>服务时间：</Text>
            <Picker mode='date' onChange={this.onFieldInput('serviced_at')}>
              <View className='input-container'>
                <Text
                  className={`input ${!serviced_at && 'input-placeholder'}`}
                >
                  {!!serviced_at ? serviced_at : '请选择服务时间'}
                </Text>
              </View>
            </Picker>
          </View>
          <View className='item-container'>
            <Text className='item-title'>软件版本：</Text>
            <View className='input-container'>
              <Input
                value={software_version}
                adjustPosition
                className='input'
                placeholderClass='input-placeholder'
                placeholder='请输入软件版本'
                onInput={this.onFieldInput('software_version')}
              />
            </View>
          </View>
          <View className='item-container'>
            <Text className='item-title'>运行状态：</Text>
            <View className='input-container'>
              <Input
                value={software_state}
                adjustPosition
                className='input'
                placeholderClass='input-placeholder'
                placeholder='请输入运行状态'
                onInput={this.onFieldInput('software_state')}
              />
            </View>
          </View>
          <View className='item-container'>
            <Text className='item-title'>运行类型：</Text>
            <View className='radio-container'>
              <RadioGroup onChange={this.onFieldInput('software_type')}>
                <Radio
                  className='radio'
                  color={radio_color}
                  value='全量'
                  checked={software_type === '全量'}
                >
                  全量
                </Radio>
                <Radio
                  className='radio'
                  style='margin-left: 12px;'
                  color={radio_color}
                  value='增量'
                  checked={software_type === '增量'}
                >
                  增量
                </Radio>
              </RadioGroup>
            </View>
          </View>
          <View className='item-container'>
            <Text className='item-title'>报错代码信息：</Text>
            <View className='input-container'>
              <Textarea
                value={error_detail}
                adjustPosition
                autoHeight
                maxlength={-1}
                className='area-input'
                placeholderClass='input-placeholder'
                placeholder='请输入报错代码信息'
                onInput={this.onFieldInput('error_detail')}
              />
            </View>
          </View>
          <View className='item-container'>
            <Text className='item-title'>ORA 报错信息：</Text>
            <View className='input-container'>
              <Textarea
                value={ora_error_detail}
                adjustPosition
                autoHeight
                maxlength={-1}
                className='area-input'
                placeholderClass='input-placeholder'
                placeholder='请输入 ORA 报错信息'
                onInput={this.onFieldInput('ora_error_detail')}
              />
            </View>
          </View>
          <View className='item-container'>
            <Text className='item-title'>故障原因：</Text>
            <View className='input-container'>
              <Textarea
                value={error_cause_detail}
                adjustPosition
                autoHeight
                maxlength={-1}
                className='area-input'
                placeholderClass='input-placeholder'
                placeholder='请输入故障原因'
                onInput={this.onFieldInput('error_cause_detail')}
              />
            </View>
          </View>
          <View className='item-container'>
            <Text className='item-title'>处理方案：</Text>
            <View className='input-container'>
              <Textarea
                value={solution_detail}
                adjustPosition
                autoHeight
                maxlength={-1}
                className='area-input'
                placeholderClass='input-placeholder'
                placeholder='请输入处理方案'
                onInput={this.onFieldInput('solution_detail')}
              />
            </View>
          </View>
          {/* <View className='item-container'>
            <View className='document-title-container'>
              <Text className='item-title'>相关文档：</Text>
              <View style='display:flex;align-items:center;'>
                <Button size='mini' onClick={this.onDocChoose}>
                  选择
                </Button>
              </View>
            </View>
            {!!upload_files && upload_files.length > 0 && (
              <View className='document-container'>
                {upload_files.map((f, i) => (
                  <View key={f.objectId} className='document-item-container'>
                    <Text className='document-item-text'>
                      {i + 1}.{' '}
                      <Text style='color:blue;text-decoration:underline;'>
                        {f.name}
                      </Text>
                    </Text>
                    <Text
                      className='document-item-delete-text'
                      onClick={this.onDeleteClick(f)}
                    >
                      删除
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View> */}
          <View className='submit-button-container'>
            <Button
              loading={creating || updating}
              className='submit-button'
              hoverClass='submit-button-hover'
              onClick={this.onFormSubmit}
            >
              提交
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
