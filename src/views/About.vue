<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { Machine, interpret, assign } from "xstate";

enum Segment {
  NONE = "none",
  EXPERIENCE = "experience",
  SKILL = "skill",
  EDU = "edu",
  LIFE = "life"
}

type ValueOf<T> = T[keyof T];
type StateSchema = {
  states: {
    idle: {};
    moving: {};
  };
};

interface MContext {
  segment: Segment;
  segmentOrder: Segment[];
}

type MEvent =
  | { type: "PREV" }
  | { type: "NEXT" }
  | { type: "JUMP"; segment: Segment };

const assignPrevSegment = assign<MContext, MEvent>({
  segment(context) {
    const currIndex = context.segmentOrder.indexOf(context.segment);
    const prevIndex =
      currIndex === 0 ? context.segmentOrder.length - 1 : currIndex - 1;
    return context.segmentOrder[prevIndex];
  }
});

const assignNextSegment = assign<MContext, MEvent>({
  segment(context) {
    const currIndex = context.segmentOrder.indexOf(context.segment);
    const nextIndex =
      currIndex === context.segmentOrder.length - 1 ? 0 : currIndex + 1;
    return context.segmentOrder[nextIndex];
  }
});

const assignJumpSegment = assign<MContext, MEvent>({
  segment(context, event) {
    if (event.type === "JUMP") {
      const targetIndex = context.segmentOrder.indexOf(event.segment);
      return context.segmentOrder[targetIndex];
    } else {
      return context.segment;
    }
  }
});

const navigationMachine = Machine<MContext, StateSchema, MEvent>(
  {
    id: "navigation",
    initial: "idle",
    context: {
      segment: Segment.NONE,
      segmentOrder: [
        Segment.NONE,
        Segment.EXPERIENCE,
        Segment.SKILL,
        Segment.EDU,
        Segment.LIFE
      ]
    },
    states: {
      idle: {
        on: {
          PREV: {
            actions: "assignPrevSegment",
            target: "moving"
          },
          NEXT: {
            actions: "assignNextSegment",
            target: "moving"
          },
          JUMP: {
            actions: "assignJumpSegment",
            target: "moving"
          }
        }
      },
      moving: {
        after: {
          500: {
            target: "idle"
          }
        }
      }
    }
  },
  {
    actions: {
      assignPrevSegment,
      assignNextSegment,
      assignJumpSegment
    }
  }
);

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
    const context = ref(stateService.initialState.context);
    const { send } = stateService;
    stateService.onChange(newContext => {
      context.value = newContext;
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
      const location = context.value.segment;
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

    const jumpTo = (key: Segment) => {
      send({ type: "JUMP", segment: key });
    };

    return {
      context,
      send,
      avatarStyle,
      jumpTo,
      Segment
    };
  }
});
</script>
<template>
  <div class="detail-wrapper">
    <div
      v-for="(segment, index) in context.segmentOrder"
      :key="index"
      class="detail"
      :class="`detail-${segment}`"
      @click="jumpTo(segment)"
    ></div>
    <div class="avatar" :style="avatarStyle">
      <img
        src="http://www.avatarsinpixels.com/minipix/eyJNb3V0aCI6IjYiLCJQYW50cyI6IjEiLCJUb3AiOiI1IiwiQmVsdCI6IjEiLCJKYWNrZXQiOiIxIn0=/1/show.png"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
$control-height: 100px;

.avatar {
  position: absolute;
  width: var(--avatar-width);
  height: var(--avatar-height);
  transition: all 0.5s;
  top: 0;
  left: 0;
}

.detail-wrapper {
  position: relative;
  height: calc(100vh - #{$control-height});
}

.detail {
  cursor: pointer;
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
