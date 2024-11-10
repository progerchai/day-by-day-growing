import React, { Component } from 'react'
import Base from '@/components/Base'
import { connect } from 'react-redux'
import { getAllTeam, getJoinRequest, joinTeam } from '@/service/profile'
import { View } from '@tarojs/components'
import styles from './index.scss'
import { showTime } from '@/utils/time'
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'
import NoData from '@/components/NoData'
import * as _ from 'lodash'

class JoinTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allTeam: [],
      requestList: [],
    }
  }

  async componentDidMount() {
    let allTeam = await getAllTeam()
    if (allTeam && allTeam.status === 200) {
      this.setState({ allTeam: allTeam.data })
      let openid = Taro.getStorageSync('openid')
      let request = await getJoinRequest({ openid })
      if (request && request.status === 200) {
        let requestList = []
        if (_.isArray(request.data)) {
          (request.data).forEach(item => requestList.push(item.team_id))
          this.setState({ requestList })
        }

      }
    }

  }

  /**
   * 申请加入团队
   * @param team_id
   */
  join = async (team_id) => {
    this.setState({ loading: true })
    let openid = Taro.getStorageSync('openid')
    const { userInfo } = this.props.user
    let result = joinTeam({ openid, team_id, create_name: userInfo.nickName })
    if (result && result.status === 200) {
      Taro.showToast({
        title: '已申请',
        icon: 'none',
        duration: 1500,
      })
      let requestList = _.cloneDeep(this.state.requestList)
      requestList.push(team_id)
      this.setState({ requestList })
    } else {
      Taro.showToast({
        title: '发送申请失败',
        icon: 'none',
        duration: 1500,
      })
    }
    this.setState({ loading: false })
  }

  render() {
    const { allTeam, loading, requestList } = this.state
    return (
      <Base>
        <View className={styles.teamBox}>
          {
            allTeam.map((team, index) => <View key={index} className={styles.teamItem}>
              <View>
                <View>{team.team_name}</View>
                <View className={styles.createTime}>{`创建时间： ${showTime((new Date(team.create_time)).getTime())}`}</View>
              </View>
              <AtButton className={styles.joinBtn} onClick={this.join.bind(this, team._id)}
                        size={'small'} loading={loading}
                        disabled={requestList.includes(team._id)}>{requestList.includes(team._id) ? '已申请' : '申请加入'}</AtButton>
            </View>)
          }
          {
            allTeam.length === 0 && <NoData desc={'暂无组织'}/>
          }
        </View>
      </Base>
    )
  }
}

export default connect(({}) => ({}))(JoinTeam)
