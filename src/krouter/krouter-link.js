export default {
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
}