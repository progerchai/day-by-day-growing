import React, { Component } from 'react'
import Base from '@/components/Base'
import { connect } from 'react-redux'
import styles from './index.scss'
import { AtList, AtListItem } from 'taro-ui'
import Taro from '@tarojs/taro'
import { getWorkerInfo, updateWorker } from '@/service/worker'

class JoinTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentInstance: Taro.getCurrentInstance(),
      worker: {},
    }
  }

  componentDidMount() {
    const { currentInstance } = this.state
    const worker = JSON.parse(currentInstance.router.params.worker)
    this.setState({ worker })
  }

  /**
   * 员工身份转译
   * @param level
   * @returns {string}
   */
  transformLevel = (level) => {
    switch (level) {
      case 1:
        return '管理员'
        break
      case 2:
        return '财务'
        break
      case 3:
        return '调度'
        break
      default:
        return '员工'
        break
    }
  }
  /**
   * 复制文本到剪切板
   * @param text
   */
  setClipboardData = (text) => {
    Taro.setClipboardData({
      data: text,
      success: function (res) {
        Taro.showToast({
          title: `复制成功`,
          duration: 1500,
        })
      },
    })
  }
  refreshWorker = async () => {
    const openid = this.state.worker.openid
    let info = await getWorkerInfo({ openid })
    if (info && info.status === 200) {
      this.setState({ worker: info.data })
    }
  }
  /**
   * 调整人员身份
   * @param e
   */
  handleChange = async (e) => {
    const levelDict = { 'schedule': 3, 'finance': 2 }
    const openid = this.state.worker.openid
    let level = levelDict[e]
    if (level !== this.state.worker.level) {
      let result = await updateWorker({ level, openid })
      if (result && result.status === 200) {
        Taro.showToast({
          title: `修改成功`,
          duration: 1500,
        })
        this.refreshWorker()
      } else {
        Taro.showToast({
          title: `修改失败`,
          duration: 1500,
        })
      }
    } else {
      let down = await updateWorker({ level: 4, openid })
      if (down && down.status === 200) {
        Taro.showToast({
          title: `修改成功`,
          duration: 1500,
        })
        this.refreshWorker()
      } else {
        Taro.showToast({
          title: `修改失败`,
          duration: 1500,
        })
      }
    }
  }

  render() {
    const { worker } = this.state
    const { name, real_name, openid, level } = worker
    return (
      <Base>
        <AtList className={styles.listBox} hasBorder={false}>
          <AtListItem title='昵称' extraText={name}
                      onClick={this.setClipboardData.bind(this, name)}/>
          <AtListItem title='真实姓名' extraText={real_name}
                      onClick={this.setClipboardData.bind(this, real_name)}/>
          <AtListItem title='id' extraText={openid}
                      onClick={this.setClipboardData.bind(this, openid)}/>
          <AtListItem title='身份' extraText={this.transformLevel(level)}/>
          <AtListItem
            title='人员调度'
            isSwitch
            switchIsCheck={level === 3}
            onSwitchChange={this.handleChange.bind(this, 'schedule')}
          />
          <AtListItem
            title='财务人员'
            isSwitch
            switchIsCheck={level === 2}
            onSwitchChange={this.handleChange.bind(this, 'finance')}
          />
        </AtList>
      </Base>
    )
  }
}

export default connect(({}) => ({}))(JoinTeam)
