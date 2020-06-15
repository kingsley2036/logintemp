import Vue from 'vue'
import Router from 'vue-router'


import Index from '@/pages/Index'
import MainFrame from '@/pages/MainFrame'
import Monitoring from '@/pages/Monitoring'
import Record from '@/pages/Record'
import Statistics from '@/pages/Statistics'
import Login from '@/pages/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '',
      component: MainFrame,
      children: [
        {
          path: '/monitoring',
          name: 'monitoring',
          component: Monitoring
        },
        {
          path: '/statistics',
          name: 'statistics',
          component: Statistics
        },
        {
          path: '/record',
          name: 'record',
          component: Record
        },
      ]
    }
  ]
})