const { ipcRenderer } = require('electron');

const namespaced = true

const state = {
  searchText: '',
  searchResult: []
}

const mutations = {
  SET_SEARCH_LIST (state, event) {
    let check = ipcRenderer.sendSync('onSearchEvent', state.searchText);
    state.searchResult = check;
  }
}

const actions = {
  searchList ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_SEARCH_LIST', event);
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
