import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

export const enum RouteName {
  Home = "home",
  About = "about"
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: RouteName.Home,
    component: Home
  },
  {
    path: "/about",
    name: RouteName.About,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
