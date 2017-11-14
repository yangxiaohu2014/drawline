import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Line from '@/components/Line'
import Bezier2 from '@/components/Bezier2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/line',
      name: 'Line',
      component: Line
    },
    {
      path: '/bezier2',
      name: 'Bezier2',
      component: Bezier2
    }
  ]
})
