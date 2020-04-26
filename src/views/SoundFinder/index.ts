import { defineComponent } from "vue";
import Macy from "macy";

interface Block {
  h: number;
  c: string;
}

interface Coordinate {
  x: number;
  y: number;
}

interface Data {
  blocks: Block[];
  masonryInstance: unknown;
  centerCoordinate: Coordinate;
  chosenBlock?: Element;
  chosenBlockCoordinate?: Coordinate;
}

const RANDOM_COLORS = ["red", "green", "blue", "yellow", "grey"];

function getCenterCoordinate(): Coordinate {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  return {
    x: width / 2 + scrollX,
    y: height / 2 + scrollY
  };
}

function getElementCoordinate(elem: Element): Coordinate {
  const bound = elem.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  return {
    x: bound.left + scrollX,
    y: bound.top + scrollY
  };
}

export default defineComponent({
  name: "SoundFinder",
  data() {
    const data: Data = {
      blocks: [],
      masonryInstance: null,
      centerCoordinate: getCenterCoordinate(),
      chosenBlock: undefined,
      chosenBlockCoordinate: undefined
    };
    return data;
  },
  computed: {
    chosenCollideWindowCenter(): Coordinate | undefined {
      if (this.centerCoordinate && this.chosenBlockCoordinate) {
        return {
          x: Math.abs(this.centerCoordinate.x - this.chosenBlockCoordinate.x),
          y: Math.abs(this.centerCoordinate.y - this.chosenBlockCoordinate.y)
        };
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCenterCoordinate);
    window.removeEventListener("scroll", this.onScroll);
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
    chooseRandomBlock() {
      const count = this.blocks.length;
      if (count) {
        const chosenIndex = Math.floor(Math.random() * count);
        const blocks = document.querySelector(".block-wrapper")?.children;
        if (blocks && chosenIndex >= 0) {
          this.chosenBlock = blocks[chosenIndex];
          this.chosenBlockCoordinate = getElementCoordinate(this.chosenBlock);
        }
      }
    },
    updateCenterCoordinate() {
      this.centerCoordinate = getCenterCoordinate();
    },
    updateChosenBlockCoordinate() {
      if (this.chosenBlock) {
        this.chosenBlockCoordinate = getElementCoordinate(this.chosenBlock);
      }
    },
    async onClickGenerate() {
      this.clearBlocks();
      await this.generateBlocks(500);
      this.chooseRandomBlock();
    },
    async onResize() {
      this.updateCenterCoordinate();
      this.updateChosenBlockCoordinate();
    },
    async onScroll() {
      this.updateCenterCoordinate();
    }
  }
});
