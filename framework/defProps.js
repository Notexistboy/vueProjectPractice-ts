// 响应式
// const obj = {}

function defineReactive(obj, key, val){
  // 处理递归方法2
  observe(val)
  // 对传入的obj进行访问拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log('get '+key);
      // 会产生闭包 保留了内部作用域变量value
      return val;
    },
    set(newVal) {
      if(newVal!== val){
        console.log('set ' + key + newVal);
        //直接对变量进行赋值 无意义？ 为什么不obj[key] = newVal;
        //obj在外面引用了 当前的值时 是不会释放的 所以value可以保存多个key的多个值 (vue的内部细节)
        //如果传入的参数为引用类型 则需要重新进行响应化处理
        if (typeof val === 'object') observe(newVal)
        else val = newVal;
      }
    }
  })
}
// 自动遍历对象实现全部属性响应式 递归处理
function observe(obj){
  if(typeof obj !== 'object' || obj === null){
    return
  }
  Object.keys(obj).forEach(key => {
    // 处理递归方法1
    /* if (typeof obj[key] !== 'object')defineReactive(obj, key, obj[key])
    else observe(obj[key]) */
    defineReactive(obj, key, obj[key])
  })
}
// 实现动态响应式绑定 条件判断 错误判断
function set(obj, key, val){
  defineReactive(obj, key, val)
}
// delete操作
function delete(obj, key, val) {
}

const obj = {
  foo:'foo',
  bar: 'bar',
  baz: { a:'a', b:'b' },
  arr:[1,2,3]
}
// 遍历做响应化处理
observe(obj)

obj.foo
obj.foo = 'foooooooo'
obj.bar
obj.bar = 'barrrrrrr'
obj.baz.a = 20
obj.baz = { a: 25 } // 赋值没有经过defineReactive
obj.baz.a = 30

// 新的属性 需要实现响应式绑定
// obj.baz1 = 'baz1'
set(obj, 'baz1', 'baz1')
obj.baz1 = 'baz1111111'
obj.baz1

//Object.defineProperty对数组无效 覆盖重写数组的方法
obj.arr.push(4)