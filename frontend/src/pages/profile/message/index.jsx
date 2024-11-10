import React, { Component } from 'react'
import Base from '@/components/Base'
import { connect } from 'react-redux'
import { getJoinRequest } from '@/service/profile'
import { updateMessage } from '@/service/message'
import NoData from '@/components/NoData'
import { View } from '@tarojs/components'
import { showTime } from '@/utils/time'
import styles from './index.scss'
import { AtButton } from 'taro-ui'

class Info extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: [],
      loading: false, // 按钮
    }
  }

  /**
   * 点击消息右侧按钮
   */
  handleClick = async (mes, command) => {
    if (['approved', 'rejected'].includes(mes.type)) {
      return
    } else {
      let result = await updateMessage({ _id: mes._id, type: command })
      if (result && result.status === 200) {
        this.getJoinMessage()
      }
    }
  }
  /**
   * 消息类型文字转换
   * @param type
   * @returns {string}
   */
  getText = (type) => {
    switch (type) {
      case 'join_team':
        return '同意加入'
      case 'approved':
        return '已同意'
      case 'rejected':
        return '已拒绝'
    }
  }

  componentDidMount() {
    this.getJoinMessage()
  }

  getJoinMessage = async () => {
    const { global } = this.props
    let message = await getJoinRequest({ openid: global.openid })
    if (message && message.status === 200) {
      this.setState({ message: message.data })
    }
  }

  render() {
    const { message, loading } = this.state
    return (
      <Base>
        {message.length === 0 ? <NoData desc={'暂无任务'}/> : <View>
          {message.map((mes, index) => <View key={index} className={styles.messageBox}>
            <View>
              <View className={styles.name}>{mes.create_name || 'unknown'}</View>
              <View className={styles.createTime}>{showTime((new Date(mes.create_time)).getTime())}</View>
            </View>
            <View className={styles.approveBtnBox}>
              {
                mes.type === 'join_team' &&
                <AtButton className={styles.approveBtn} onClick={this.handleClick.bind(this, mes, 'approved')}
                          size={'small'} loading={loading}>同意加入</AtButton>
              }
              {
                mes.type === 'join_team' &&
                <AtButton className={styles.approveBtn} onClick={this.handleClick.bind(this, mes, 'rejected')}
                          size={'small'} loading={loading}>拒绝加入</AtButton>
              }
              {
                ['approved', 'rejected'].includes(mes.type) &&
                <AtButton className={styles.approveBtn} onClick={this.handleClick.bind(this, mes, 'rejected')}
                          size={'small'} loading={loading}
                          disabled={true}>{this.getText(mes.type)}</AtButton>
              }
            </View>
          </View>)}
        </View>}
      </Base>
    )
  }
}

export default connect(({ global }) => ({ global }))(Info)
