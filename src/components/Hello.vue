<template>
  <div>
    <!-- vuex -->
    <h3 @click="add">{{counter}}</h3> 
    <h3 @click="asycAdd">{{counter}}</h3>
    <!-- 属性 -->
    <h3>{{msg}}</h3>    <!-- 新增特性 -->
    <p><input type="text" @keydown.enter="addFeature"></p>
    <!-- ts特性列表 -->
    <ul>
        <li v-for="feature in features" :key="feature.id">{{feature.name}}</li>
        <li>特性总数{{count}}个</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Feature } from '@/types';
import {Component, Prop, Vue, Emit, Watch} from'vue-property-decorator';
import { getFeatures } from '@/api/feature';
import { Action, State, Mutation } from "vuex-class";

@Component // 装饰器 
export default class Hello extends Vue {
    // vuex整合推荐vuex-class
    @State counter!: number;
    // add即是type，类型是函数且无返回值
    @Mutation add!: () => void;
    // add仍是type，但是会和上面重名，需要换个变量名
    // 类型是函数返回值是Promise
    @Action("add") asycAdd!: () => Promise<number>;

    // 属性就是data
    // features: string[] = ['类型注解', '编译型语言'],
    features: Feature[] = [];// 通过类型推论可以直接声明

    // 括号中的配置给Vue
    // 变量附件的配置给ts !为一定断言 将来肯定会赋值
    @Prop({type: String, required: true})
    msg!: string;


    @Emit()
    // 函数直接作为回调
    addFeature(e:KeyboardEvent){
      // e.target.value 键盘事件target没有value属性 需要通过断言换成input事件
      const inp = (e.target as HTMLInputElement)
      this.features.push({name:inp.value, id:this.features.length+1})
      inp.value = ''
    }; 
    // 如何和生命周期同名, 就是生命周期
    created(){
      // getFeatures().then(res => {
      //   this.features = res.data;
      // })
      this.$axios.get<Feature[]>('/api/list').then(res => {
        this.features = res.data;
      })
    };
    get count (){
      return this.features.length
    };
}
</script>

<style  lang='less' scoped>

</style>