import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import styles from './index.scss'
import Base from '@/components/Base'
import TabBar from '@/components/TabBar'
import NoData from '@/components/NoData'
import Taro from '@tarojs/taro'
import { showTime } from '@/utils/time'
import { getWorks } from '@/service/work'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workList: [],
      todayFinishedworkList: [{
        _id: '610ac19b0988cc6d21b82493',
        title: '团委毕业典礼',
        desc: 'xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxx是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情xxxxxxxxxxxxxx我是详情',
        create_time: '1626797817000',
      }, {
        _id: '610ac19b0988cc6d21b82493',
        title: '团委毕业典礼',
        desc: 'xxxxxxxxxxxxxx我是详情',
        create_time: '1626797817000',
      }],
    }
  }

  componentDidMount() {
    const openid = Taro.getStorageSync('openid') || this.props.openid
    this.getWorks(openid)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.props.openid && nextProps.openid) {
      this.getWorks(nextProps.openid)
    }
  }

  getWorks = async (openid) => {
    Taro.showLoading({
      title: '加载中',
    })
    if (openid) {
      let works = await getWorks({ openid })
      if (works && works.status === 200) {
        this.setState({ workList: works.data.data })
      }
    }
    Taro.hideLoading()
  }

  render() {
    const { system: { info } } = this.props
    const { workList, todayFinishedworkList } = this.state
    if (!info.menuRect) {
      Taro.showLoading({
        title: '加载中',
      })
      return null
    } else {
      Taro.hideLoading()
      return (
        <Base>
          <View className={styles.workWrapper}>
            <View className={styles.currentText}>当前任务</View>
            {
              workList.length ? workList.map((work, index) => {
                const workDetail = work.work[0]
                return <View className={styles.workCard} key={index}>
                  <View className={styles.more} onClick={() => {
                    Taro.navigateTo({ url: `/pages/workDetail/index?_id=${workDetail._id}` })
                  }}>查看详情</View>
                  <View className={styles.title}><View className={styles.itemName}>内容：</View>{workDetail.content}</View>
                  <View className={styles.desc}><View className={styles.itemName}>详情：</View>{workDetail.desc}</View>
                  <View className={styles.createTime}><View
                    className={styles.itemName}>创建时间：</View>{showTime((new Date(workDetail.create_time)).getTime())}
                  </View>
                </View>
              }) : <NoData desc={'暂无任务'}/>
            }
            <View className={styles.currentText}>今日已完成任务</View>
            {
              todayFinishedworkList.length ? todayFinishedworkList.map((work, index) => <View
                className={styles.workCard} key={index}>
                <View className={styles.more} onClick={() => {
                  console.log(work._id)
                }}>查看详情</View>
                <View className={styles.title}><View className={styles.itemName}>内容：</View>{work.title}</View>
                <View className={styles.desc}><View className={styles.itemName}>详情：</View>{work.desc}</View>
                <View className={styles.createTime}><View className={styles.itemName}>创建时间：</View>{work.create_time}
                </View>
              </View>) : <NoData desc={'暂无今日已完成任务'}/>
            }
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
}

export default connect(({ system, global }) => ({ system, ...global }))(Index)
