import Vue from 'vue'
import {Component, Prop, Ref} from 'vue-property-decorator';



@Component
export default class MyMixin extends Vue {
    created(){
        console.log('created in my-mixin')
    }
    customMethod(){

    }
}