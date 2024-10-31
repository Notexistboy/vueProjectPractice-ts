<template>
  <div>
    <!-- <HelloWorld /> -->
    <Hello  msg="typescript"/>
    <Hello2 :msg="msg"/>
    <!-- el-form -->
    <el-form ref="loginForm"></el-form>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Ref} from 'vue-property-decorator';
  import HelloWorld from './components/HelloWorld.vue';
  import Hello from './components/Hello.vue';
  import Hello2 from './components/Hello2.vue';
  import moment from 'moment' 
  import {Form} from 'element-ui' 

  Component.registerHooks([
    'beforeRouteEnter'
  ])

  @Component({
    components:{
      HelloWorld,
      Hello,
      Hello2
    }
  })
  export default class App extends Vue {
    msg = moment().format('YYYY/MM/DD')

    // 使用@Ref装饰器
    @Ref() loginForm!: Form;

    onSubmit() {
      // this.loginForm.validate(isValid => {
      //   if(isValid){
      //     console.log('校验通过')
      //   }else{
      //     console.log('校验失败')
      //   }
      // })
      this.loginForm.validate().then(isValid => {
        if(isValid){
          console.log('校验通过')
        }else{
          console.log('校验失败')
        }
      })
    }

  }
</script>

<style  lang='less' scoped>

</style>