import React, { Component } from 'react'
import { connect } from 'react-redux'
import Base from '@/components/Base'
import Taro from '@tarojs/taro'
import { getWorkDetail } from '@/service/work'
import { AtImagePicker, AtInput, AtList, AtListItem, AtMessage, AtTextarea, AtToast } from 'taro-ui'
import { Picker, View } from '@tarojs/components'
import styles from './index.scss'
import { getWorker } from '@/service/establish'
import * as _ from 'lodash'

/**
 * 工作详情字典
 * @type {{price: string, count: string, units: string, department: string, content: string, customer: string, desc: string}}
 */
const workDetialdict = {
  department: '单位部门',
  content: '活动内容',
  customer: '甲方下单人',
  desc: '任务内容',
  units: '单位',
  count: '数量',
  price: '单价',
}
/**
 * 员工字典
 */
const formPicker = [
  { key: 'salesman', title: '业务员' },
  { key: 'schedule', title: '调度总体' },
  { key: 'finance', title: '财务总体' },
  { key: 'design', title: '平面设计' },
  { key: 'machining', title: '加工' },
  { key: 'procurement', title: '采购' },
  { key: 'av', title: '影音', range: [] },
  { key: 'stage_equipment', title: '舞台设备' },
  { key: 'installation', title: '配送安装' },
  { key: 'settlement', title: '结算' },
]

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workDetail: {},
      currentInstance: Taro.getCurrentInstance(),
      employees: [{ name: '无', real_name: '无', openid: null }], //团队所有雇员
      formValue: {},// picker 表单数据
      files: [], // 图片
      showPreviewFaildToast: false,
    }
  }

  async componentDidMount() {
    const { currentInstance } = this.state
    const work_id = currentInstance.router.params._id
    let result = await getWorkDetail({ _id: work_id })
    if (result && result.status === 200) {
      let url = _.get(result, 'data.data.url')
      let files = []
      if (url) {
        files = [{ url }]
      }
      this.setState({ workDetail: result.data.data, files })
    }
    // 获取所有团队员工
    const { teamInfo } = this.props
    if (teamInfo._id) {
      let worker = await getWorker({ team_id: teamInfo._id })
      this.setState({ employees: [...this.state.employees, ...worker.data.employees] })
    }
  }

  /**
   * 修改任务信息
   */
  onChange = (key, value) => {
    const formValue = _.cloneDeep(this.state.formValue)
    const workDetail = _.cloneDeep(this.state.workDetail)
    workDetail[key] = value
    formValue[key] = value
    this.setState({
      formValue,
      workDetail,
    })
  }

  /**
   * 下拉选
   * @param {*} key
   * @param {*} e
   */
  pickerChange(key, e) {
    const { employees } = this.state
    const formValue = _.cloneDeep(this.state.formValue)
    const workDetail = _.cloneDeep(this.state.workDetail)
    if (!workDetail.staff[key]) {
      workDetail.staff[key] = {}
    }
    workDetail.staff[key].name = employees[e.detail.value].name
    formValue[key] = employees[e.detail.value].openid
    this.setState({
      formValue,
      workDetail,
    })
  }

  /**
   * 修改备注信息
   */
  noteChange(value) {
    const formValue = _.cloneDeep(this.state.formValue)
    const workDetail = _.cloneDeep(this.state.workDetail)
    formValue.note = value
    workDetail.note = value
    this.setState({
      formValue,
      workDetail,
    })
  }

  /**
   * 图片修改
   * @param files
   */
  onChangeImg = files => {
    this.setState({
      files,
    })
  }
  /**
   * 提交修改
   */
  handleSubmit = async () => {
    const { files, formValue } = this.state
    console.log(123456, '预览')
    // if (this.checkAllFilled()) {
    //   Taro.showLoading({
    //     title: '创建中...',
    //   })
    //   let url = null
    //   if (files.length > 0) {
    //     let res = await this.uploadSingleImg(files[0])
    //     if (res) {
    //       res = JSON.parse(res)
    //       url = _.get(res, 'data.url', null)
    //     }
    //   }
    //   let openid = Taro.getStorageSync('openid')
    //   let result = await createWork({ ...formValue, url, openid })
    //   Taro.hideLoading()
    //   if (result && result.status === 200) {
    //     // 创建成功
    //     let _id = result.data._id
    //     Taro.redirectTo({ url: `/pages/workDetail/index?_id=${_id}` })
    //   } else {
    //     Taro.showToast({
    //       title: '创建失败',
    //       duration: 2000,
    //     })
    //   }
    // } else {
    //   this.setState({ showPreviewFaildToast: true })
    // }

  }

  render() {
    const { workDetail, employees, formValue, files, showPreviewFaildToast } = this.state
    const { system: { info }, user } = this.props
    let employeesList = []
    employees.forEach(item => employeesList.push(item.name))
    if (!info.menuRect) {
      Taro.showLoading({
        title: '加载中',
      })
      return null
    } else {
      Taro.hideLoading()
      return (
        <Base>
          {/*任务详情 {JSON.stringify(workDetail)}*/}
          {Object.keys(workDetialdict).map((key, index) => {
            return <AtInput
              key={index}
              name={key}
              disabled={![1, 3].includes(user.level)} // 1 管理员，3 调度员
              title={workDetialdict[key]}
              type='text'
              placeholder={workDetail[key]}
              value={workDetail[key] || ''}
              onChange={(e) => this.onChange(key, e)}
            />
          })}
          {
            formPicker.map((item, index) => {
              let work_item = _.get(workDetail, `staff.${item.key}`, {}) || {}
              let name = work_item.name
              return <Picker key={index} mode='selector' range={employeesList}
                             disabled={![1, 3].includes(user.level)}
                             onChange={(value) => {this.pickerChange(item.key, value)}}>
                <AtList hasBorder={false}>
                  <AtListItem
                    className={styles.extraText}
                    title={item.title}
                    extraText={name || ''}
                  />
                </AtList>
              </Picker>
            })
          }
          {
            <AtList hasBorder={false}>
              <AtListItem
                title='上传图片'
                hasBorder={false}
              >
              </AtListItem>
              <AtImagePicker
                files={files}
                onChange={this.onChangeImg}
                count={1}
                multiple={false}
                showAddBtn={files.length === 0}
              />
            </AtList>
          }
          {
            <AtList hasBorder={false}>
              <AtListItem
                title='备注'
                hasBorder={false}
              />
              <AtTextarea
                value={formValue.note || workDetail.note}
                onChange={this.noteChange.bind(this)}
                maxLength={200}
                disabled={![1, 3].includes(user.level)}
                placeholder='请输入你的备注...'
              />
            </AtList>
          }
          <View className={styles.formAtButton}>
            <button className={styles.normalBtn} formType={'submit'} onClick={this.handleSubmit.bind(this)}>提交修改</button>
          </View>
          <AtToast isOpened={showPreviewFaildToast} text={'请检查有未填项'} status={'error'} onClose={() => {
            this.setState({ showPreviewFaildToast: false })
          }}/>
          <AtMessage/>
        </Base>
      )
    }
  }
}

export default connect(({ system, global, user }) => ({ system, ...global, user }))(Index)
