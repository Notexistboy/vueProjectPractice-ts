// 1.实现一个插件：挂载$router
import Link from './krouter-link'
import View from './krouter-view'

let Vue;

class KVueRouter {
  constructor(options){
    this.$options = options
    console.log(this.$options,'this.$options');
    // 需要创建响应式current属性
    // Vue.set 或 Vue.util.defineReactive响应式的添加属性
    this.current = window.location.hash.slice(1) || '/';
    // Vue.util.defineReactive(this, 'current', '/')
    // 路由层级匹配数组
    Vue.util.defineReactive(this, 'matched', [])
    // match方法可以递归的遍历路由表，获得匹配关系的数组
    this.match()
    // 上下文是window手动改成this
    // 路由改变
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    // 刷新页面
    window.addEventListener('load', this.onHashChange.bind(this))
    // 创建一个路由映射表
    // this.routeMap = {}
    // options.routes.forEach(route => {
    //   this.routeMap[route.path] = route
    // })
  }
  // hashChange方法
  onHashChange() {
    console.log(window.location.hash,'window.location.hash');
    // '#/router'
    this.current = window.location.hash.slice(1)
    this.matched = []
    this.match()
  }
  match(routes) {
    routes = routes || this.$options.routes
    // 递归遍历路由表
    for (const route of routes){
      // 匹配首页
      if(route.path === '/' && this.current === '/'){
        this.matched.push(route)
        return
      }
      // /about/info
      if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route)
        if (route.children && route.children.length)
          this.match(route.children)
          return
      }
    }
  }
}
//静态方法
KVueRouter.install = function(_Vue) {
  // 保存构造函数，在KVueRouter(插件)中使用
  Vue = _Vue;

  // 挂载$router
  // 怎么获取到根实例中的router选项
  Vue.mixin({
    beforeCreate() {
      // 确保根实例的时候才执行
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }

    }
  })

  //注册两个全局组件
  Vue.component('router-link', Link)
  /* Vue.component('router-link', {
      props: {
        to: {
          type: String,
          required: true
        },
      },
      render(h) {
        // <a href="#/about">abc</a>
        // <router-link to="/about">xxx</router-link>
        // h(tag, data, children)// 标签中的内容(子元素)就是插槽
        console.log(this.$slots);
        return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
        // jsx写法
        // return <a href={'#' + this.to}>{this.$slots.default}</a>
      }
  }) */

  Vue.component('router-view', View)
}

export default KVueRouter
