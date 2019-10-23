import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import AddJob from "@/components/AddJob"
import EditJob from "@/components/EditJob"
import Help from "@/components/Help"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/add',
      name: 'add-job',
      component: AddJob
    },
    {
      path: '/edit/:job',
      name: 'edit-job',
      component: EditJob
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    }
  ]
})
