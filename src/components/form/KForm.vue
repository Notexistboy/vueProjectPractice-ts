<template>
  <div>
    <!-- 匿名插槽用来接收formItem标签 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'KForm',
  componentName: 'KForm',
  /* element中直接将整个表单向下透传 */
  provide() {
    return {
      form:this
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object
    }
  },
  data() {
    return {
      fields:[]
    }
  },
  mounted() {
    this.$on('kkb.form.addField', (field) => {
      if (field) {
        this.fields.push(field);
      }
    });
  },
  methods: {
    // 接收判断校验结果的回调
    validate(cb) {
      // 获取所有孩子KFormItem
      // [resultPromise]
      const tasks = this.$children
        .filter(item => item.prop) // 过滤掉没有prop属性的Item
        .map(item => item.validate());

      // 统一处理所有Promise结果 异步的处理结果
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false));
    }
  }
};
</script>

<style scoped>
</style>