<template>
  <div class="home">
    <img src="@/assets/logo.png" />
    <p @click="$store.commit('add')">counter:{{ $store.state.counter }}</p>
    <p @click="$store.dispatch('add')">async counter:{{ $store.state.counter }}</p>
    <p>double counter:{{ $store.getters.doubleCounter }}</p>
  </div>
</template>

<script lang="ts">
import { extend } from 'vue/types/umd';
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import communication from '@/components/communication/index.vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import { Action, State, Mutation, namespace } from 'vuex-class';
import MyMixin from '@/mixins/my-mixin';

const userModule = namespace('user');

@Component({
  name: 'app',
  components: {
    communication,
  },
})
export default class Home extends Vue {
  @userModule.State('name')
  username!: string;

  @userModule.Mutation
  setUser!: (userInfo: { name: string; token: string }) => void;

  created() {
    this.setUser({ name: '123', token: '456' });
  }

  beforeRouteEnter(to: Route, form: Route, next) {
    console.log('beforeRouteEnter');
    next((vm: Vue) => {
      console.log(vm);
    });
  }
}
</script>
