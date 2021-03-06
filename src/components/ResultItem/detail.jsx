import { View, Text } from '@tarojs/components'
import dayjs from 'dayjs'
import './style.scss'

const ResultDetail = ({ data, onClick }) => {
  const {
    createdAt,
    updatedAt,
    client_name,
    serviced_at,
    technican,
    error_detail,
    ora_error_detail,
    software_version,
    error_cause_detail,
    software_type,
    solution_detail,
    software_state
    // related_files
  } = data
  return (
    <View className='container' onClick={onClick}>
      <View className='item-container'>
        <Text className='title'>
          上传时间：
          <Text className='content' style='text-decoration:underline;'>
            {dayjs(createdAt).format('lll')}
          </Text>
        </Text>
      </View>
      <View className='item-container'>
        <Text className='title'>
          更新时间：
          <Text className='content' style='text-decoration:underline;'>
            {dayjs(updatedAt).format('lll')}
          </Text>
        </Text>
      </View>
      {!!client_name && (
        <View className='item-container'>
          <Text className='title'>
            客户名称：
            <Text className='content'>{client_name}</Text>
          </Text>
        </View>
      )}
      {!!serviced_at && (
        <View className='item-container'>
          <Text className='title'>
            服务时间：
            <Text className='content'>{serviced_at}</Text>
          </Text>
        </View>
      )}
      {!!technican && (
        <View className='item-container'>
          <Text className='title'>
            服务人员：
            <Text className='content'>{technican}</Text>
          </Text>
        </View>
      )}
      <View className='item-container'>
        <Text className='title'>
          软件版本：
          <Text className='content'>{software_version}</Text>
        </Text>
      </View>
      {!!software_state && (
        <View className='item-container'>
          <Text className='title'>
            运行状态：
            <Text className='content'>{software_state}</Text>
          </Text>
        </View>
      )}
      {!!software_type && (
        <View className='item-container'>
          <Text className='title'>
            运行类型：
            <Text className='content'>{software_type}</Text>
          </Text>
        </View>
      )}
      {!!error_detail && (
        <View className='item-container'>
          <Text className='title'>报错代码信息（详细）：</Text>
          <View className='content-container'>
            <Text className='content'>{error_detail}</Text>
          </View>
        </View>
      )}
      {!!ora_error_detail && (
        <View className='item-container'>
          <Text className='title'>ORA 报错信息（详细）：</Text>
          <View className='content-container'>
            <Text className='content'>{ora_error_detail}</Text>
          </View>
        </View>
      )}
      {!!error_cause_detail && (
        <View className='item-container'>
          <Text className='title'>故障原因（详细）：</Text>
          <View className='content-container'>
            <Text className='content'>{error_cause_detail}</Text>
          </View>
        </View>
      )}
      {!!solution_detail && (
        <View className='item-container'>
          <Text className='title'>处理方案（详细）：</Text>
          <View className='content-container'>
            <Text className='content'>{solution_detail}</Text>
          </View>
        </View>
      )}
      {/* {!!related_files && related_files.length > 0 && (
        <View className='item-container'>
          <Text className='title'>相关文档：</Text>
          <View className='content-container'>
            {related_files.map((f, i) => (
              <View key={f.objectId} className='document-item-container'>
                <Text className='document-item-text' onClick={onDocClick(f)}>
                  {i + 1}.{' '}
                  <Text style='color:blue;text-decoration:underline;'>
                    {f.name}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      )} */}
    </View>
  )
}

ResultDetail.defaultProps = {
  query: '',
  data: {
    client_name: null
  },
  onClick: () => null
  // onDocClick: () => null
}

export default ResultDetail
