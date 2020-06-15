'use strict'

import Vue from 'vue'
import Vuex from 'vuex'

import getters from '@/vuex/getters'
import actions from '@/vuex/actions'
import mutations from '@/vuex/mutations'

Vue.use(Vuex)

const state = {
    login: {
        account: '',
        isAdmin: false,
        sc: '',
        token: '',
        userId: '',
        userName: ''
    },
    sys: {
        dicts: {},
        roles: {},
        orgs: {}
    },
    monitor: {
        sites: [],
        devices: [],
        standards: [],
        simpling: []
    }
}

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})