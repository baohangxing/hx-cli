import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  lang: '',
};

const actions = {};

const mutations = {
  setLang: (state, payload) => {
    state.lang = payload;
  },
};

const getters = {};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
});
