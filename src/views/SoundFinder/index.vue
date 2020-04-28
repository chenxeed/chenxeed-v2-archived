<template>
  <div class="menu-wrapper">
    <h2>Where is the sound coming from?</h2>
    <div>
      <button @click="onClickGenerate">Generate</button>
    </div>
  </div>
  <div
    ref="blockWrapper"
    class="block-wrapper"
    :class="{ fullscreen: enterGameMode }"
  >
    <div v-if="enterGameMode" class="block-spacer">
      <div class="block-container">
        <div
          v-for="(block, index) in blocks"
          :key="index"
          class="block"
          :tabindex="index + 1"
          :style="{
            height: `${block.h}vh`,
            'background-color': block.c,
            opacity: index === chosenBlockIndex ? 1 : 0.2
          }"
        />
      </div>
    </div>
  </div>
  <div class="debugger">
    Window center coordinate:<br />
    {{ centerCoordinate }}<br /><br />
    Chosen center coordinate:<br />
    {{ chosenBlockCoordinate }}<br /><br />
    Chosen met window center:<br />
    {{ chosenCollideWindowCenter }}<br />
    Volume: {{ soundVolume }}
  </div>
</template>
<script lang="ts" src="./"></script>
<style lang="scss" scoped>
.block-wrapper {
  position: relative;
  overflow: scroll;
  border: 1px solid black;

  &.fullscreen {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.block-spacer {
  width: 200%;
  padding: 50%;
}

.block-container {
  width: 100%;
}

.block {
  cursor: pointer;
  border: 2px solid black;
  transition: 0.2s transform;

  &:hover,
  &:focus {
    transform: scale(1.1);
  }
}

.debugger {
  position: fixed;
  top: 100px;
  right: 100px;
  width: 200px;
  height: 200px;
  background: white;
  border: 1px solid black;
}
</style>
