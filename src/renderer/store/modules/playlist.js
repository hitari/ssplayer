const { ipcRenderer } = require('electron');

const namespaced = true

const state = {
  list: []
}

const mutations = {
  SET_SEARCH_LIST (state, payload) {
    let data = ipcRenderer.sendSync('onSearchPlayList', payload);
    state.list = data;
  },
  ADD_PLAYLIST (state, payload) {
    let data = ipcRenderer.sendSync('onSaveEvent', payload);
    state.list = data;
  },
  REMOVE_PLAYLIST (state, payload) {
    payload = state.list.filter((i)=> i.active)
    let data = ipcRenderer.sendSync('onRemoveEvent', payload);
    state.list = data;
  },
  SET_ACTIVE (state, payload) {
    for(let r in state.list){
      if(state.list[r].id == payload.id){
        state.list[r].active = payload.active
      }
    }
  }
}

const actions = {
  searchList ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_SEARCH_LIST', payload);
      resolve();
    })
  },
  addPlaylist ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('ADD_PLAYLIST', payload);
      resolve();
    })
  },
  removePlaylist({ commit }, payload){
    return new Promise((resolve, reject) => {
      commit('REMOVE_PLAYLIST', payload);
      resolve();
    })
  },
  changeActive ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_ACTIVE', payload);
      resolve();
    })
  }
}

const getters = {
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
