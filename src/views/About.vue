<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Machine, interpret } from "xstate";

type StateSchema = {
  states: {
    none: {};
    experience: {};
    skill: {};
    edu: {};
    life: {};
  };
};

type MEvent = { type: "PREV" } | { type: "NEXT" };

const navigationMachine = Machine<any, StateSchema, MEvent>({
  id: "navigation",
  initial: "none",
  states: {
    none: {
      on: { PREV: "life", NEXT: "experience" }
    },
    experience: {
      on: { PREV: "none", NEXT: "skill" }
    },
    skill: {
      on: { PREV: "experience", NEXT: "edu" }
    },
    edu: {
      on: { PREV: "skill", NEXT: "life" }
    },
    life: {
      on: { PREV: "edu", NEXT: "none" }
    }
  }
});

export default defineComponent({
  name: "about",
  setup() {
    const stateService = interpret(navigationMachine);

    const state = ref(stateService.initialState);
    const { send } = stateService;
    stateService.onTransition(newState => (state.value = newState));

    onMounted(() => {
      stateService.start();
      document.addEventListener("keydown", e => {
        switch (e.key) {
          case "ArrowLeft":
          case "ArrowUp":
            send("PREV");
            break;
          case "ArrowRight":
          case "ArrowDown":
            send("NEXT");
            break;
        }
      });
    });

    return {
      state,
      send
    };
  }
});
</script>
<template>
  <div class="about">
    <div class="field">
      <div class="detail detail-experience"></div>
      <div class="detail detail-skill"></div>
      <div class="detail detail-edu"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
