import App from './App.vue';
import router from '@/router/router';
import store from '@/store';
import MetaInfo from 'vue-meta-info';
import * as filters from '@/utils/filters'; // global filters
import Config from '@/config'; // 加载配置文件

window.Config = Config;

Vue.use(MetaInfo);

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: h => h(App),
  created() {},
  /* 这句非常重要，否则预渲染将不会启动 */
  mounted() {
    document.dispatchEvent(new Event('render-event'));
    // document.dispatchEvent(new Event("custom-render-trigger"));
  }
}).$mount('#root');
