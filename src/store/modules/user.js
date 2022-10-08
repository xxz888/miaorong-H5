const user = {
  state: {
    loading: false,
    channelAuthDialog: false,
    unread: 0,

  },
  mutations: {
    Unread: (state, num) => {
      state.unread = num
    },
    Loading: (state) => {
      state.loading = true
    },
    closeLoading: (state) => {
      state.loading = false
    },
    UPDATE_CHANNELAUTHDIALOG(state, channelAuthDialog) {
      state.channelAuthDialog = channelAuthDialog
    }
  },

  actions: {}
}

export default user
