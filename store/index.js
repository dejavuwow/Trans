import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import state from "./state.js";
import mutations from "./mutation.js";


const store = new Vuex.Store({
	state,
	mutations,
});

export default store;