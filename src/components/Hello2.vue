<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// 目标: 返回组件的构造函数
// function Component(options: any) {
//   return function(target: any) {
//     return Vue.extend(options);
//   }
// }

@Component({
  props: {
    msg: String
  }
})
export default class Hello2 extends Vue {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
