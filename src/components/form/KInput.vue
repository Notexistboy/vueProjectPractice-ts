<template>
  <div>
    <!-- 自定义组件双向绑定：:value  @input -->
    <!-- v-bind="$attrs"展开$attrs 进行属性的绑定 -->
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs">
  </div>
</template>

<script>
  import emitter from '../../mixins/emitter'
  export default {
    inheritAttrs: false, // 设置为false避免设置到根元素上
    mixins: [emitter],
    // 可以绑定model
    model:{
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      }
    },
    methods: {
      onInput(e) {
        // 派发一个input事件即可
        this.$emit('change', e.target.value)

        // 通知父级执行校验 不能直接通过emit进行事件通信
        // this.$parent.$emit('validate')

        this.dispatch("KFormItem", 'validate')
      }
    },
  }
</script>

<style scoped>

</style>