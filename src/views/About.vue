<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { Machine, interpret } from "xstate";

enum Segment {
  NONE = "none",
  EXPERIENCE = "experience",
  SKILL = "skill",
  EDU = "edu",
  LIFE = "life"
}

type ValueOf<T> = T[keyof T];
type StateSchema = {
  states: Record<Segment, {}>;
};

const jumpAction = {
  actions: ["jumpTo"]
};
const jumpToState = Object.keys(Segment).reduce<Record<string, string>>(
  (event, state) => {
    event[`TO_${state}`] = (Segment as Record<any, any>)[state];
    return event;
  },
  {}
);

type MEvent =
  | { type: "PREV" }
  | { type: "NEXT" }
  | { type: "TO_NONE" }
  | { type: "TO_EXPERIENCE" }
  | { type: "TO_SKILL" }
  | { type: "TO_EDU" }
  | { type: "TO_LIFE" };

const navigationMachine = Machine<any, StateSchema, MEvent>({
  id: "navigation",
  initial: Segment.NONE,
  states: {
    [Segment.NONE]: {
      on: { PREV: Segment.LIFE, NEXT: Segment.EXPERIENCE, ...jumpToState }
    },
    [Segment.EXPERIENCE]: {
      on: { PREV: Segment.NONE, NEXT: Segment.SKILL, ...jumpToState }
    },
    [Segment.SKILL]: {
      on: { PREV: Segment.EXPERIENCE, NEXT: Segment.EDU, ...jumpToState }
    },
    [Segment.EDU]: {
      on: { PREV: Segment.SKILL, NEXT: Segment.LIFE, ...jumpToState }
    },
    [Segment.LIFE]: {
      on: { PREV: Segment.EDU, NEXT: Segment.NONE, ...jumpToState }
    }
  }
});

export default defineComponent({
  name: "about",
  setup() {
    // avatar size
    const avatarSize = [50, 50];
    // CSS variable
    const cssVariable = {
      "--avatar-width": avatarSize[0] + "px",
      "--avatar-height": avatarSize[1] + "px"
    };

    const mounted = ref(false);
    const stateService = interpret(navigationMachine);
    const state = ref(stateService.initialState);
    const { send } = stateService;
    stateService.onTransition(newState => {
      state.value = newState;
    });

    onMounted(() => {
      mounted.value = true;
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

    const avatarStyle = computed(() => {
      if (!mounted.value) {
        return;
      }
      const location = state.value.value;
      const locationElement = document.querySelector(`.detail-${location}`);
      if (locationElement) {
        const style = getComputedStyle(locationElement);
        return {
          top: parseInt(style.top) - avatarSize[1] / 2 + "px",
          left: parseInt(style.left) - avatarSize[0] / 2 + "px",
          ...cssVariable
        };
      }
    });

    const jumpTo = (key: keyof typeof Segment) => {
      const to = (`TO_` + key) as MEvent["type"];
      send(to);
    };

    return {
      state,
      send,
      avatarStyle,
      jumpTo,
      Segment
    };
  }
});
</script>
<template>
  <div>
    <div
      v-for="(segment, key) in Segment"
      :key="key"
      class="detail"
      :class="`detail-${segment}`"
      @click="jumpTo(key)"
    />
    <div class="avatar" :style="avatarStyle">
      <img
        src="http://www.avatarsinpixels.com/minipix/eyJNb3V0aCI6IjYiLCJQYW50cyI6IjEiLCJUb3AiOiI1IiwiQmVsdCI6IjEiLCJKYWNrZXQiOiIxIn0=/1/show.png"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.avatar {
  position: absolute;
  width: var(--avatar-width);
  height: var(--avatar-height);
  transition: all 0.5s;
  top: 0;
  left: 0;
}

.detail {
  position: absolute;
  &:before {
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    transform: translateX(-10px);
    border-radius: 50%;
    background: black;
  }

  &.detail-none {
    top: 10%;
    left: 50%;
  }

  &.detail-experience {
    top: 30%;
    left: 80%;
  }

  &.detail-skill {
    top: 50%;
    left: 20%;
  }

  &.detail-edu {
    top: 70%;
    left: 80%;
  }

  &.detail-life {
    top: 90%;
    left: 20%;
  }
}
</style>
