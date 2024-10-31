// 保存构造函数引用，避免import
let Vue;

class Store{
  // 用户传递进来的所有选项
  constructor(options){
    // this.$options = options;
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._wrappedGetters = options.getters;

    //定义computed选项
    const computed = {}
    this.getters = {}

    const store = this
    Object.keys(this._wrappedGetters).forEach(key => {
      const fn = store._wrappedGetters[key]

      computed[key] = function (){
        return fn(store.state)
      }

      //为getters定义只读属性
      Object.defineProperty(store.getters, key, {
        get:() => store._vm[key]
      })
    })
    // 响应式处理state
    // this.store = new Vue({
    //   data: options.state,
    // })

    // 响应式处理state
    this._vm = new Vue({
      data: {
        // 加两个$，Vue不做代理 对用户隐藏
        $$state: options.state
      },
      computed
    })
    // 绑定commit dispatch的上下文为store实例
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
    // 官方是绑定的方式更优雅

  }

  // 存取器， store.state
  get state() {
    console.log(this);
    console.log(this._vm);

    return this._vm._data.$$state
  }

  set state(v) {
    console.error('你造吗？你这样不好！');

  }
  // 官方是通过$watch直接监视用户修改 如果有改动直接报错
  commit(type, payload) {
    // 获取mutation中方法
    const entry = this._mutations[type]
    if (entry) entry(this.state, payload)
  }
  // 考虑作用域上下文
  dispatch(type, payload) {
    // 获取action中方法
    const entry = this._actions[type]
    if (entry) entry(payload)
  }
}
function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      //拿到根节点的store 暴露在prototype上
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
// 不能直接写在store上 此时还没有拿到vue构造函数
// Store.install = install
// Vuex
export default {
  Store,
  install
}