// 数组响应式
/* 
1. 替换数组原型中的七个方法 
2. 克隆拿到的数组原型 备份 并进行修改
*/
const originalProto = Array.prototype;
const arrayProto = Object.create(originalProto);
['push', 'pop', 'shift', 'unshift', 'slice', 'sort', 'reverse'].forEach(method => {
  arrayProto[method]= function () {
    // 调用原始操作
    originalProto[method].apply(this, arguments)
    // 覆盖操作:通知更新
    console.log('set ' + method + ':' + arguments)

  }
})

// 对象响应式
function defineReactive(obj, key, val) {
  // 处理递归方法2 处理嵌套引用数据类型
  observe(val)
  // 创建一个Dep和当前key一一对应
  const dep = new Dep();
  // 对传入的obj进行访问拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log('get ' + key);
      // 创建一个key会进行一个依赖收集
      Dep.target && dep.addDep(Dep.target)
      // 会产生闭包 保留了内部作用域变量value
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set ' + key + newVal);
        //直接对变量进行赋值 无意义？ 为什么不obj[key] = newVal;
        //obj在外面引用了 当前的值时 是不会释放的 所以value可以保存多个key的多个值 (vue的内部细节)
        //如果传入的参数为引用类型 则需要重新进行响应化处理
        if (typeof val === 'object') observe(newVal)
        else val = newVal;
        // 有值传入则更新(更新全部数据)
        // watchers.forEach(w => w.update())
        // 更新对应的数据 调用watcher中的update方法 dep并不会被清除(会一直被引用 和val一样)
        dep.notify()
      }
    }
  })
}
// 自动遍历对象实现全部属性响应式 递归处理
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }
  // 判断是数组还是对象
  if (Array.isArray(obj)) {
    //覆盖原型 替换七个变更操作
    obj.__proto__ = arrayProto
    // 对数组内部元素进行响应化
    const keys = Object.keys(obj)
    for(let i =0; i<obj.length; i++){
      observe(obj[i])
    }
  }else{
    Object.keys(obj)
  }
  // 创建Observer的实例
  new Observer(obj);
}
// 实现动态响应式绑定 条件判断 错误判断
function set(obj, key, val) {
  defineReactive(obj, key, val)
}
// delete操作
/* function delete(obj, key, val) {
} */
//代理函数 方便直接访问
function proxy(vm, sourceKey){
  Object.keys(vm[sourceKey]).forEach(key => {
    Object.defineProperty(vm, key, {
      get(){
        console.log('get ' + key);
        return vm[sourceKey][key]
      },
      set(newVal) {
        console.log('set ' + key);
        vm[sourceKey][key] = newVal
      }
    })
  })
}

class KVue{
  constructor(options){
    //保存
    this.$options = options
    this.$data = options.data
    this.$method = options.methods
    //响应化处理
    observe(this.$data)

    //代理
    proxy(this, '$data')
    proxy(this, '$method')
    //编译
    new Compiler(options.el, this)
  }
}
//根据数据类型决定如何做响应化
class Observer {
  constructor(value) {
    this.value = value

    //判断类型
    // value instanceof Object
    if (typeof value === 'object') {
      this.walk(value);
    }
  }
  // 对象数据响应化
  walk(obj){
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

//暂时替代deps
const watchers = []
//创建观察者 保存更新函数 值发生变化调用更新函数
class Watcher {
  // 当前实例和
  constructor(vm,key,updateFn){
    this.vm = vm
    this.key = key
    this.updateFn = updateFn
    // watchers.push(this)
    // Dep.target静态属性上设置为当前watcher实例
    Dep.target = this
    this.vm[this.key] // 读取触发getter 进行依赖收集
    Dep.target = null // 收集完就放空
  }
  update(){
    // 更新最新的值
    this.updateFn.call(this.vm,this.vm[this.key])
  }
}

// Dep: 依赖, 管理某个key相关的所有watcher实例
class Dep{
  constructor(){
    this.deps = []
  }

  addDep(dep){
    this.deps.push(dep)
  }

  notify(){
    this.deps.forEach(dep => dep.update())
  }
}