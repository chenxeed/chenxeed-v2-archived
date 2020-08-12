import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

export const enum RouteName {
  Home = "home",
  About = "about",
  Blog = "blog"
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: RouteName.Home,
    component: Home
  },
  {
    path: "/blog",
    name: RouteName.Blog,
    component: () => import(/* webpackChunkName: "blog" */ "../views/Blog.vue")
  },
  {
    path: "/about",
    name: RouteName.About,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
