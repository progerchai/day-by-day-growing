import React, { Component } from 'react'
import { View } from '@tarojs/components'
import styles from './index.scss'
import Base from '@/components/Base'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import { connect } from 'react-redux'
import Taro from '@tarojs/taro'
import TabBar from '@/components/TabBar'
import { getTeam } from '@/service/profile'
import IconFont from '@/iconfont'
import * as _ from 'lodash'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      team: { _id: 'xxxx', team_name: '特典' },
      user: {
        level: 1, // 权限等级1 为管理员，2为财务，3为调度，4为普通员工
      },
      userInfo: {},
    }
  }

  componentDidShow = () => {
    Taro.hideHomeButton()
  }

  async componentDidMount() {
    const { user, global } = this.props
    if (user.team._id === false) {
      let team = await getTeam({ openid: global.openid })
      if (team && team.status === 200) {
        this.setState({ team: team.data })
        this.props.dispatch({
          type: 'user/updateState',
          payload: { team: team.data },
        })
      }
    } else {
      // 载入team 团队伍信息到state
      this.setState({ team: user.team })
    }
  }

  /**
   * 主动登录授权
   * @returns {Promise<void>}
   */
  handleAvatar = async () => {
    this.checkProfile()
  }
  getProfile = () => {
    const that = this
    Taro.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        console.log(res)
        that.setState({ userInfo: res.userInfo })
        this.props.dispatch({ type: 'user/updateState', payload: { userInfo: res.userInfo } })
      },
    })
  }
  /**
   * 检查是否授权
   * @returns {boolean}
   */
  checkProfile = () => {
    if (!_.isEmpty(this.state.userInfo)) {
      return true
    } else {
      this.getProfile()
      return false
    }
  }
  /**
   * 我的，页面跳转
   */
  handleClickItem = (page) => {
    Taro.navigateTo({ url: `/pages/profile/${page}/index` })
  }

  render() {
    const { team, user, userInfo } = this.state
    return (
      <Base>
        <View className={styles.profileWrapper}>
          <View className={styles.avatar} onClick={this.handleAvatar}>
            {
              userInfo.avatarUrl ? <AtAvatar circle image={userInfo.avatarUrl} size={'large'}/> :
                <View className={styles.defaultAvatar}>
                  <IconFont name={'icon-Avatar'} size={50} style={{ display: 'inline-block' }}/>
                </View>
            }
            <View className={styles.nickName}>{userInfo.nickName ? userInfo.nickName : '点击登录'}</View>
          </View>
          <View className={styles.content}>
            <AtList className={styles.card}>
              {
                team._id ? <AtListItem title='组织名称' extraText={team.team_name}/> :
                  <AtListItem title='加入组织' arrow='right' onClick={this.handleClickItem.bind(this, 'join_team')}/>
              }
              {
                user.level === 1 &&
                <AtListItem title='消息中心' arrow='right' onClick={this.handleClickItem.bind(this, 'message')}/>
              }
              {
                user.level === 1 &&
                <AtListItem title='人员管理' arrow='right' onClick={this.handleClickItem.bind(this, 'worker_manage')}/>
              }
              <AtListItem title='员工通讯录' arrow='right' onClick={this.handleClickItem.bind(this, 'contacts')}/>
            </AtList>
            <AtList className={styles.card}>
              <AtListItem title='任务记录查询' arrow='right' onClick={this.handleClickItem.bind(this, 'history')}/>
              <AtListItem title='个人信息' arrow='right' onClick={this.handleClickItem.bind(this, 'info')}/>
            </AtList>
          </View>
        </View>
        <TabBar
          fixed
          tabList={[
            {
              title: '任务', icon: 'icon-Workbeifen2',
              direct: '/pages/index/index',
            },
            {
              title: '创建', icon: 'icon-search',
              direct: '/pages/establish/index',
            },
            {
              title: '我的', icon: 'icon-myself_off',
              direct: '/pages/profile/index',
            },
          ]}
          style={{ color: 'black' }}
        />
      </Base>
    )
  }
}

export default connect(({ user, global }) => ({ user, global }))(Profile)
