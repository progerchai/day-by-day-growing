import React, { Component } from 'react'
import Base from '@/components/Base'
import { connect } from 'react-redux'
import { getWorkers } from '@/service/team'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import styles from './index.scss'

class WorkerManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workers: [],
    }
  }

  async componentDidMount() {
    let openid = Taro.getStorageSync('openid')
    let result = await getWorkers({ openid })
    if (result && result.status === 200) {
      this.setState({ workers: result.data })
    }
  }

  handleClickWorker = (worker) => {
    Taro.navigateTo({ url: `/pages/profile/worker_manage/worker_detail/index?worker=${JSON.stringify(worker)}` })
  }

  render() {
    const { workers } = this.state
    return (
      <Base>
        <View className={styles.workerBox}>
          {workers.map((item, index) => <View key={index} className={styles.workItem}
                                              onClick={this.handleClickWorker.bind(this, item)}>
            <View>{item.real_name}</View>
            <View>...</View>
          </View>)}
        </View>
      </Base>
    )
  }
}

export default connect(({}) => ({}))(WorkerManage)
