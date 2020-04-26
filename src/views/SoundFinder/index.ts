import { defineComponent } from "vue";
import Macy from "macy";

interface Block {
  h: number;
  c: string;
}

interface Data {
  blocks: Block[];
  soundIdx: number;
  masonryInstance: unknown;
}

const RANDOM_COLORS = ["red", "green", "blue", "yellow", "grey"];

export default defineComponent({
  name: "SoundFinder",
  data() {
    const data: Data = {
      blocks: [],
      soundIdx: -1,
      masonryInstance: null
    };
    return data;
  },
  methods: {
    clearBlocks() {
      this.blocks = [];
    },
    async generateBlocks(count: number) {
      const sizeMin = 5;
      const sizeMax = 10;
      const randSize = () =>
        Math.round(Math.random() * (sizeMax - sizeMin) + sizeMin);
      const randColor = () =>
        RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
      for (let i = 0; i < count; i++) {
        this.blocks.push({
          h: randSize(),
          c: randColor()
        });
      }

      await this.$nextTick();

      this.masonryInstance = Macy({
        container: document.querySelector(".block-wrapper"),
        margin: 30,
        columns: 10,
        breakAt: {
          480: 6
        }
      });
    },
    onClickGenerate() {
      this.clearBlocks();
      this.generateBlocks(500);
    }
  }
});
