// 编译器

// 递归遍历dom树

// 判断节点类型，如果是文本，则判断是否是插值绑定

// 如果是元素，则遍历其属性判断是否是指令或事件，然后递归

class Compiler{
  /**
  * @description: 编译构造器
  * @param {String} el 绑定的dom节点名称
  * @param {Object} vm KVue类的实例
  * @return: undefined
  */
  // el是宿主元素
  // vm是KVue实例
  constructor(el, vm){
    this.$vm = vm;
    this.$el = document.querySelector(el);
    
    if(this.$el){
      //执行编译
      this.compile(this.$el)
    }
  }

  /**
  * @description: 执行编译过程方法
  * @param {Object HTMLDivElement} el dom对象
  * @return: undefined
  */
  compile(el){
    //遍历el树
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      //判断是否是元素
      if(this.isElement(node)){
        console.log('编译元素'+node.nodeName)
        this.compileElement(node)
      }else if(this.isInter(node)){
        console.log('编译插值绑定' + node.textContent)
        this.compileText(node)
      }
      if(node.childNodes && node.childNodes.length){
        this.compile(node)
      }
    });
  }
  /* 判断是否是元素节点 */
  isElement(node) {
    return node.nodeType === 1
  }
  /* 判断是否是文本 */
  isInter(node) {
    //首先是文本 内容是{{xxx}}
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  /* 判断是否是指令 */
  isDirective(attr){
    return attr.indexOf('k-') === 0
  }
  /* 判断是否是方法 */
  isEvent(attr) {
    return attr.indexOf('@') === 0
  }

  eventHandler(node, exp, dir){
    const fn = this.$vm.$options.methods[exp]
    node.addEventListener(dir, fn.bind(this.$vm), false)
  }
  /**
  * @description: 编译文本内容 并进行挂载
  * @param {object Text} node 文本节点
  * @return: undefined
  */
  compileText(node){
    // 与正则表达式匹配的第一个 子匹配(以括号为标志)字符串 匹配完立刻执行了
    // 存在代理可以直接访问 直接访问$vm上的属性 相当于访问$data中的属性
    // node.textContent = this.$vm[RegExp.$1]
    // 通过更新函数进行更新
    this.update(node, RegExp.$1, 'text')
  }
  // 遍历当前节点
  compileElement(node){
    // 节点是元素
    // 遍历其属性列表
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      //规定：指令以k-xx="oo"定义 或 @xx="oo"
      //遍历标签上属性
      const attrName = attr.name // 获取属性名
      const exp = attr.value // 获取属性值
      if (this.isDirective(attrName)){
        //获取指令名既函数名
        const dir = attrName.substring(2) // xx
        // 执行
        this[dir] && this[dir](node, exp)
      }
      if (this.isEvent(attrName)) {
        //获取指令名既函数名
        const dir = attrName.substring(1) // click
        // 时间监听
        this.eventHandler(node, exp, dir)
      }
    })
  }
 
  /**
  * @description:  更新函数作用：1.初始化, 2.创建Watcher实例
  * @param {object Text} node 文本节点
  * @param {object RegExp} exp 对应变量名
  * @param {String} dir 指令名
  * @return: undefined
  */
  update(node, exp, dir){
    // 指令对应更新函数xxUpdater
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])
    // 更新处理 创建watcher实例 封装更新函数 更新对应dom
    // 传入一个函数 watcher中会调用更新函数
    // vue1 一个变量一个watcher vue2以后 一个组件一个watcher diff算法
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val)
    })
  }
  // 指令对应的方法集
  model(node, exp) {
    // update方法只完成赋值和更新
    this.update(node, exp, 'model')

    // 事件监听
    node.addEventListener('input', e=> {
      // 新的值赋值给数据
      this.$vm[exp] = e.target.value
    })

  }
  modelUpdater(node, value) {
    node.value = value
  }
  text(node, exp) {
    // node.innerText = this.$vm[exp]
    this.update(node, exp, 'text')
  }
  textUpdater(node, value) {
    node.textContent = value
  }
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(node, exp, 'html')
  }
  htmlUpdater(node, value) {
    node.innerHTML = value
  }
}
//