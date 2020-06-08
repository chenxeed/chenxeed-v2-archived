<template>
  <div id="app">
    <div class="navigation">
      <div>
        <img class="mw-100" src="/logo-chenxeed.png" />
      </div>
      <router-link class="text-light router" to="/">Home</router-link>
      <router-link class="text-light router" to="/labs">Labs</router-link>
      <router-link class="text-dark router" to="/blog">Blog</router-link>
      <router-link class="text-dark router" to="/about">About</router-link>
    </div>
    <div class="container-fluid">
      <router-view />
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
    return {
      isHomepage: true
    };
  },
  mounted() {
    (this.$router as Router).beforeEach(route => {
      if (route.name === RouteName.Home) {
        this.isHomepage = true;
      } else {
        this.isHomepage = false;
      }
      console.log(this.isHomepage);
    });
  }
});
</script>
<style lang="scss">
@import url("~bootstrap/scss/bootstrap.scss");

$footer-height: 50px;

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - #{$footer-height});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  .router {
    width: 80%;
    text-align: center;
    padding: 1em;
    transition: all 0.25s ease;

    &:nth-child(2) {
      background: #2d728f;
    }
    &:nth-child(3) {
      background: #3b8ea5;
    }
    &:nth-child(4) {
      background: #f5ee9e;
    }
    &:nth-child(5) {
      background: #f49e4c;
    }

    &:hover {
      width: 100%;
      box-shadow: 1px 5px 5px black;
      text-decoration: none;
    }
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
