<template>
  <div>
    <!-- label -->
    <label v-if="label">{{label}}</label>
    <!-- 匿名插槽用来接收具体元素标签 -->
    <slot></slot>
    <!-- 校验信息显示 -->
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
// Asyc-validator
import Schema from "async-validator";
import emitter from '../../mixins/emitter';
export default {
  inject: ["form"],
  name: 'KFormItem',
  componentName: 'KFormItem',
  mixins: [emitter],
  data() {
    return {
      error: "" // error是空说明校验通过
    };
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: {
      type: String
    }
  },
  mounted() {
    // 事件谁触发谁监听
    this.$on("validate", () => {
      this.validate();
    });
    // 派发通知form 添加item实例
    this.dispatch('KForm', 'kkb.form.addField', [this])
    
  },
  methods: {
    validate() {
      // 获取当前组件规则
      const rules = this.form.rules[this.prop];
      // 获取当前组件当前值
      const value = this.form.model[this.prop];

      // 校验描述对象 判断是否需要校验
      const desc = { [this.prop]: rules };
      // 创建Schema实例
      const schema = new Schema(desc);
      // 校验规则是key: value的形式
      return schema.validate({ [this.prop]: value }, errors => {
        if (errors) {
          this.error = errors[0].message;
        } else {
          // 校验通过
          this.error = "";
        }
      });
    }
  }
};
</script>

<style scoped>
</style>