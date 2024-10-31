export default {
  render(h) {
    // 获取path对应的component
    /* let component = null;
    this.$router.$options.routes.forEach(route => {
      if(route.path === this.$router.current){
        component = route.component
      }
    }) */

    this.$vnode.data.routerView = true;
    // 标记深度
    let depth = 0;
    //获取path对应的component
    let parent = this.$parent;
    while(parent){
      const vnodeData = parent.$vnode && parent.$vnode.data;
      if(vnodeData && vnodeData.routerView){
        // 说明当前parent是一个router-view
        depth++;
      }
      parent = parent.$parent;
    }
    //映射表
    // const { routeMap, current } = this.$router;
    // console.log(routeMap, current);
    // const component = routeMap[current].component || null;

    // 处理层级嵌套
    
    let component = null
    const route = this.$router.matched[depth]
    console.log(this.$router.matched, 'this.$router.matched')
    if(route){
      component = route.component
    }
    return h(component)
  }
}