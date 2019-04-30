const { ipcRenderer } = require('electron');

const namespaced = true

const state = {
  searchText: '',
  searchResult: [],
  naverDic: true,
  daumDic: true
}

const mutations = {
  SET_SEARCH_LIST (state) {
    let check = ipcRenderer.sendSync('onSearchEvent', state.searchText);
    state.searchResult = check;
  },
  SET_TOGGLE_DIC (state, payload){
    state[payload + 'Dic'] = state[payload + 'Dic']?false:true;
  }
}

const actions = {
  searchList ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_SEARCH_LIST', event);
      resolve();
    })
  },
  toggleDic ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_TOGGLE_DIC', payload);
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
