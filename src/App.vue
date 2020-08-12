<template>
  <div id="app">
    <div class="navigation" :class="navigationClass">
      <div>
        <img class="mw-100" src="/logo-chenxeed.png" />
      </div>
      <router-link class="text-light router" to="/">Home</router-link>
      <router-link class="text-light router" to="/labs">Labs</router-link>
      <router-link class="text-dark router" to="/blog">Blog</router-link>
      <router-link class="text-dark router" to="/about">About</router-link>
    </div>
    <div class="container-fluid content" :class="containerClass">
      <Suspense>
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </div>
    <div class="footer px-5 bg-dark text-white">
      <div>&copy; chenxeed 2020</div>
      <div>Github, Twitter, etc</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watchEffect } from "vue";
import { Router } from "vue-router";
import { RouteName } from "@/router";
export default defineComponent({
  name: "App",
  data() {
    const data: { routeName: RouteName } = {
      routeName: RouteName.Home
    };
    return data;
  },
  computed: {
    isHomepage() {
      return this.routeName === RouteName.Home;
    },
    navigationClass() {
      return this.isHomepage ? "" : "side";
    },
    containerClass() {
      const bgClass = `bg-color-${this.routeName}`;
      const widthClass = this.isHomepage ? "" : "show";
      return [bgClass, widthClass];
    }
  },
  mounted() {
    (this.$router as Router).beforeEach((to, from, next) => {
      if (typeof to.name === "string") {
        this.routeName = to.name as RouteName;
      }
      next();
    });
  }
});
</script>
<style lang="scss">
@import "~bootstrap/scss/bootstrap/";
</style>
<style lang="scss" scoped>
$footer-height: 50px;
$side-width: 100px;
$colors: (
  "home": #2d728f,
  "labs": #3b8ea5,
  "blog": #f5ee9e,
  "about": #f49e4c,
  "nav": beige
);
$nav-transition-time: 0.5s;

@each $name, $color in $colors {
  .bg-color-#{$name} {
    background-color: $color;
  }
}

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - #{$footer-height});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  transition: all $nav-transition-time cubic-bezier(0.55, 0.06, 0.68, 0.19);

  &.side {
    width: $side-width;
    background: map-get($map: $colors, $key: "nav");
  }

  .router {
    width: 80%;
    text-align: center;
    padding: 1em;
    transition: all 0.25s ease;

    @each $name, $color in $colors {
      $i: index(($colors), ($name $color)) + 1;
      &:nth-child(#{$i}) {
        background: $color;
      }
    }

    &:hover {
      width: 100%;
      box-shadow: 1px 5px 5px black;
      text-decoration: none;
    }
  }
}

.content {
  left: $side-width;
  position: relative;
  transition: all $nav-transition-time cubic-bezier(0.55, 0.06, 0.68, 0.19)
    $nav-transition-time;
  margin: 0px;
  width: calc(100% - #{$side-width});
  visibility: hidden;
  opacity: 0;

  &.show {
    margin-bottom: $footer-height;
    visibility: visible;
    opacity: 1;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: $footer-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
