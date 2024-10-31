import Vue from 'vue'
import Notice from '@/components/Notice.vue'
function create(Component, props) {
  // 组件构造函数如何获取？
  // 1.Vue.extend()
  // 产生的是构造函数
  /* const Ctor = Vue.extend(Component)
  // 产生的就是真实的对象实例
  const comp = new Ctor({ propsData: props })
  comp.$mount();
  document.body.appendChild(comp.$el)
  comp.remove = () => {
    // 移除dom
    document.body.removeChild(comp.$el)
    // 销毁组件
    comp.$destroy();
  } */
  // 2.render
  const vm = new Vue({
    // h是createElement, 返回VNode，是虚拟dom
    // 需要挂载才能变成真实dom
    render: h => h(Component, {props}),
  }).$mount() // 不指定宿主元素，则会创建真实dom，但是不会追加操作

  // 获取真实dom
  document.body.appendChild(vm.$el)
  // 获取真实的对象实例
  const comp = vm.$children[0]

  // 删除
  comp.remove = function() {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }

  return comp

}

export default {
  //改造成插件的形式通过vue.use注册 可配置更多的功能
  install(Vue) {
    Vue.prototype.$notice = function (options) {
      return create(Notice, options)
    }
  }
}