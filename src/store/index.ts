import Vue from 'vue';
import Vuex from 'vuex';
import { RootState } from '../types';
import { user } from './user';
Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {
    counter: 0,
    name: '',
    token: '',
  },
  getters: {
    doubleCounter(state) {
      return state.counter * 2;
    },
  },
  mutations: {
    add(state) {
      state.counter++;
      // this.state
    },

    setUser(state, { name, token }) {
      (state.name = name), (state.token = token);
    },
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('add');
      }, 1000);
    },
  },
  modules: {
    user,
  },
});
