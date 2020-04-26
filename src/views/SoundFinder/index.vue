<template>
  <div>
    <h2>Where is the sound coming from?</h2>
    <div>
      <button @click="onClickGenerate">Generate</button>
    </div>
  </div>
  <div class="block-wrapper">
    <div
      v-for="(block, index) in blocks"
      :key="index"
      class="block"
      :tabindex="index + 1"
      :style="{ height: `${block.h}vh`, 'background-color': block.c }"
    />
  </div>
</template>
<script lang="ts" src="./"></script>
<style lang="scss" scoped>
.block-wrapper {
  position: relative;
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
</style>
