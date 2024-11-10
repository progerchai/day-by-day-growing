import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtToast } from 'taro-ui'
import { connect } from 'react-redux'

import * as _ from 'lodash'
import styles from './index.scss'

class Base extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showToast: false,
      toast: {
        text: '',
        icon: '',
        duration: 1000,
      },
    }
  }

  handleClose() {
    // todo: 顶层弹窗操作
  }

  async loadUserInfo() {
    const userInfo = await Taro.getStorageSync('userInfo')
    console.log('userInfo', userInfo)
    const reg = new RegExp('\\\\/', 'g')

    if (userInfo.avatar) {
      userInfo.avatar = _.replace(userInfo.avatar, reg, '/')
    }

  }

  componentDidMount() {
    // 获取用户基本信息
    this.loadUserInfo()
  }

  render() {
    const {
      showToast,
      toast: { text, icon, duration },
    } = this.state
    const { info } = this.props.system

    return (
      <View className={styles.base}>
        <AtToast
          isOpened={showToast}
          text={text}
          icon={icon}
          duration={duration}
          onClose={this.handleClose.bind(this)}
        />
        {this.props.children}
        <View className={styles.safeContent}>
          Powerd By Progerchai
        </View>
      </View>
    )
  }
}

export default connect(({ system }) => ({ system }))(Base)
