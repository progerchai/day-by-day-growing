import React, { Component } from 'react'
import { ScrollView, View } from '@tarojs/components'
import { connect } from 'react-redux'
import styles from './index.scss'
import Base from '@/components/Base'
import TabBar from '@/components/TabBar'
import Taro from '@tarojs/taro'
import {
  AtFloatLayout,
  AtForm,
  AtImagePicker,
  AtInput,
  AtList,
  AtListItem,
  AtMessage,
  AtTextarea,
  AtToast,
} from 'taro-ui'
import { createWork, getWorker } from '@/service/establish'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formInput: [
        { key: 'department', title: '单位部门', placeholder: '填写单位部门', isRequire: true },
        { key: 'content', title: '活动内容', placeholder: '填写活动内容', isRequire: true },
        { key: 'customer', title: '甲方下单人', placeholder: '填写甲方下单人', isRequire: true },
        { key: 'desc', title: '任务内容', placeholder: '填写任务内容', isRequire: true },
        { key: 'units', title: '单位', placeholder: '填写单位', isRequire: true },
        { key: 'count', title: '数量', placeholder: '填写数量', isRequire: true },
        { key: 'price', title: '单价', placeholder: '填写单价', isRequire: true },
      ],
      formPicker: [
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
      ],
      formValue: {},
      note: '',
      files: [],
      showPreviewFaildToast: false, // 是否显示预览失败提示
      employees: [{ name: '无', real_name: '无', openid: null }], //团队所有雇员
      isFloatLayoutOpen: true, // 多选弹窗是否显示
      pickerItem: {}, // 多选被选择项
    }
  }

  componentDidShow = () => {
    Taro.hideHomeButton()
  }

  async componentDidMount() {
    // 获取所有团队员工
    const { global } = this.props
    if (global.teamInfo._id) {
      let worker = await getWorker({ team_id: global.teamInfo._id })
      this.setState({ employees: [...this.state.employees, ...worker.data.employees] })
    }
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

  /***
   * 文本框输入
   */
  onChange(key, value) {
    const formValue = _.cloneDeep(this.state.formValue)
    formValue[key] = value
    this.setState({
      formValue,
    })
  }

  /**
   * 下拉选
   * @param {*} key
   * @param {*} e
   */
  pickerChange(key, e) {
    const { employees } = this.state
    const formPicker = _.cloneDeep(this.state.formPicker)
    const formValue = _.cloneDeep(this.state.formValue)
    let keyIndex = formPicker.findIndex(item => item.key === key)
    formPicker[keyIndex].value = employees[e.detail.value].name
    formValue[key] = employees[e.detail.value].openid
    this.setState({
      formPicker,
      formValue,
    })
  }

  noteChange(value) {
    this.setState({
      note: value,
    })
  }

  /**
   * 检查是是否所有必填项都已经填写
   */
  checkAllFilled = () => {
    const { formInput, formValue } = this.state
    return !formInput.some(item => item.isRequire && _.isEmpty(formValue[item.key]))
  }

  /**
   * 提交
   */
  handleSubmit = async () => {
    const { files, formValue } = this.state
    if (this.checkAllFilled()) {
      Taro.showLoading({
        title: '创建中...',
      })
      let url = null
      if (files.length > 0) {
        let res = await this.uploadSingleImg(files[0])
        if (res) {
          res = JSON.parse(res)
          url = _.get(res, 'data.url', null)
        }
      }
      let openid = Taro.getStorageSync('openid')
      let result = await createWork({ ...formValue, url, openid })
      Taro.hideLoading()
      if (result && result.status === 200) {
        // 创建成功
        let _id = result.data._id
        Taro.redirectTo({ url: `/pages/workDetail/index?_id=${_id}` })
      } else {
        Taro.showToast({
          title: '创建失败',
          duration: 2000,
        })
      }
    } else {
      this.setState({ showPreviewFaildToast: true })
    }

  }

  /**
   * 上传单个文件
   */
  uploadSingleImg = (file) => {
    const { global } = this.props
    return new Promise((resolve, reject) => {
      Taro.uploadFile({
        url: global.api + '/upload',
        filePath: file.url,
        name: `file`,
        formData: {
          'openid': global.openid,
        },
        header: {
          'Content-Type': 'multipart/form-data',//记得设置
        },
        success(res) {
          resolve(res.data)
        },
        fail(res) {
          reject(res)
        },
      })
    })

  }
  /**
   * 重置表单
   */
  onReset = () => {
    let formPicker = _.cloneDeep(this.state.formPicker)
    formPicker.forEach(item => item.value = '')
    this.setState({ formValue: {}, formPicker })
    Taro.atMessage({
      'message': '重置成功',
      'type': 'success',
    })
  }
  /**
   * 获取浮动弹窗的内容
   */
  getFloatLayout = () => {
    return <View>1234 <button onClick={this.onCloseFloatLayout.bind(this)}>关闭弹窗</button></View>
  }
  /**
   * 关闭浮动弹窗
   */
  onCloseFloatLayout = () => {
    this.setState({ isFloatLayoutOpen: false })
  }
  /**
   * 多选选择器方法
   * @param pickerItem
   */
  floatLayoutPicker = (pickerItem) => {
    console.log(12341234, pickerItem, pickerItem.title)
    let item = _.cloneDeep(pickerItem)
    this.setState({ pickerItem: item, isFloatLayoutOpen: true })
  }

  render() {
    const { formInput, formPicker, formValue, showPreviewFaildToast, employees, isFloatLayoutOpen, pickerItem } = this.state
    let employeesList = []
    employees.forEach(item => employeesList.push(item.name))
    const { system: { info } } = this.props
    if (!info.menuRect) {
      Taro.showLoading({
        title: '加载中',
      })
      return null
    } else {
      Taro.hideLoading()
      return (
        <Base>
          <ScrollView
            className={styles.scrollview}
            scrollY
            scrollWithAnimation={false}
            scrollTop={0}
            lowerThreshold={0}
            upperThreshold={0}
            style={{ position: isFloatLayoutOpen ? 'fixed' : 'auto' }}
          >
            <AtForm>
              {formInput.map((item, index) => <View key={index}>
                <AtInput
                  name={item.key}
                  title={item.title}
                  type='text'
                  placeholder={item.placeholder}
                  value={formValue[item.key] || ''}
                  required="true"
                  onChange={(e) => this.onChange(item.key, e)}
                />
              </View>)
              }
              {formPicker.map((item, index) =>
                  // <Picker key={index} mode='selector' range={employeesList}
                  //         onChange={(value) => {this.pickerChange(item.key, value)}}>
                  <AtList hasBorder={false}>
                    <AtListItem
                      className={styles.extraText}
                      title={item.title}
                      extraText={item.value || ''}
                      onClick={this.floatLayoutPicker.bind(this, item)}
                    />
                  </AtList>,
                // </Picker>
              )}
              <AtList hasBorder={false}>
                <AtListItem
                  title='上传图片'
                  hasBorder={false}
                >
                </AtListItem>
                <AtImagePicker
                  files={this.state.files}
                  onChange={this.onChangeImg}
                  count={1}
                  multiple={false}
                />
              </AtList>
              <AtList hasBorder={false}>
                <AtListItem
                  title='备注'
                  hasBorder={false}
                />
                <AtTextarea
                  value={this.state.note}
                  onChange={this.noteChange.bind(this)}
                  maxLength={200}
                  placeholder='请输入备注...'
                />
              </AtList>
              <View className={styles.formAtButton}>
                <button className={styles.normalBtn} formType={'submit'} onClick={this.handleSubmit.bind(this)}>提交创建
                </button>
                <button onClick={this.onReset.bind(this)}>重置</button>
              </View>
            </AtForm>
          </ScrollView>
          <AtToast isOpened={showPreviewFaildToast} text={'请检查有未填项'} status={'error'} onClose={() => {
            this.setState({ showPreviewFaildToast: false })
          }}/>
          <AtMessage/>
          <AtFloatLayout isOpened={isFloatLayoutOpen} title={null} scrollY onClose={this.onCloseFloatLayout.bind(this)}>
            {pickerItem.title}
            {this.getFloatLayout()}
          </AtFloatLayout>
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

export default connect(({ system, global, video }) => ({ system, global, video }))(Index)
