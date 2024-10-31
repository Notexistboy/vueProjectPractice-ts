// 声明文件
// 使用ts开发时如果要使用第三方js库的同时还想利用ts诸如类型检查等特性就需要声明文件，类似xx.d.ts
// 同时，vue项目中还可以在shims-vue.d.ts中编写声明，从而扩展模块，这个特性叫模块补充

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
// shims-vue.d.ts 
import Vue from "vue";
import { AxiosInstance } from "axios";

// 利用模块的扩展 
declare module "vue/types/vue" {
  //扩展vue实例的接口
  interface Vue {
    $axios: AxiosInstance; 
  }
}

import VueRouter from "vue-router";
import { Store } from "vuex";

// 扩展ComponentOptions选项
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    router?: VueRouter;
    store?: Store<any>;
  }
}