export default {
  namespace: 'user',
  state: {
    userInfo: {},
    team: { _id: false }, //组织
    level: 1,
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
