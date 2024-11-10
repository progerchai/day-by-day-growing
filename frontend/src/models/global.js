/**
 * 小程序 全局变量
 */
export default {
  namespace: 'global',
  state: {
    videoScrollDelta: 0.2,// 视频滚动监听阈值，滚动到屏幕高度0.2 的时候确认滚动生效
    version: 'v1',
    debug: false, // 全局开启调试模式
    activeIndex: 0, // tab index
    api: 'http://127.0.0.1:7005/api',
    teamInfo: {},
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {},
  subscriptions: {},
}
