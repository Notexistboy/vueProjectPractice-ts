/* 自上而下的派发事件 */
// 组件名 事件名 参数数组
function broadcast(componentName, eventName, params) {
  // 遍历所有子元素 如果子元素的 
  this.$children.forEach(child => {
    var name = child.$options.componentName;
    // componentName和传入的componentName相同则派发事件
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    // 冒泡查找componentName相同的组件 并派发事件
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      // 向上查找知道找到相同名称的组件
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      // 如果找到则派发事件
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};