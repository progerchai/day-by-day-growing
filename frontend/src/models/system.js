export default {
  namespace: 'system',
  state: {
    info: {},
    finishInit: false,// appjs 是否完成初始化加载
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
