import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/home',
      component: () =>
        import(
          /* webpackChunkName: "home" */
          '../views/pages/home/index.vue'
        )
    },
    {
      path: '/about',
      component: () =>
        import(
          /* webpackChunkName: "about" */
          '../views/pages/about/index.vue'
        )
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
