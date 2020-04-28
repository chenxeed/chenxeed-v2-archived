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
  centerCoordinate?: Coordinate;
  chosenBlockIndex?: number;
  chosenBlock?: Element;
  chosenBlockCoordinate?: Coordinate;
  volumeRange: number; // the minimal range to be able to listen to the sound
  enterGameMode: boolean;
}

const RANDOM_COLORS = ["red", "green", "blue", "yellow", "grey"];

let domBlockWrapper: Element | null = null;
function getBlockCenterCoordinate(): Coordinate | undefined {
  if (!domBlockWrapper) {
    domBlockWrapper = document.querySelector(".block-wrapper");
  }
  if (domBlockWrapper) {
    const width = domBlockWrapper.clientWidth;
    const height = domBlockWrapper.clientHeight;
    const scrollX = domBlockWrapper.scrollLeft;
    const scrollY = domBlockWrapper.scrollTop;
    return {
      x: width / 2 + scrollX,
      y: height / 2 + scrollY
    };
  }
}

function getElementCoordinate(elem: Element): Coordinate {
  const bound = elem.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  return {
    x: bound.left + (bound.right - bound.left) / 2 + scrollX,
    y: bound.top + (bound.bottom - bound.top) / 2 + scrollY
  };
}

export default defineComponent({
  name: "SoundFinder",
  data() {
    const data: Data = {
      blocks: [],
      masonryInstance: null,
      centerCoordinate: undefined,
      chosenBlockIndex: undefined,
      chosenBlock: undefined,
      chosenBlockCoordinate: undefined,
      volumeRange: 1000,
      enterGameMode: false
    };
    return data;
  },
  computed: {
    chosenCollideWindowCenter(): Coordinate | undefined {
      if (this.centerCoordinate && this.chosenBlockCoordinate) {
        return {
          x: this.centerCoordinate.x - this.chosenBlockCoordinate.x,
          y: this.centerCoordinate.y - this.chosenBlockCoordinate.y
        };
      }
    },
    soundVolume(): number {
      if (this.chosenCollideWindowCenter) {
        const horizontalVolume =
          (this.volumeRange - Math.abs(this.chosenCollideWindowCenter.x)) /
          this.volumeRange;
        const verticalVolume =
          (this.volumeRange - Math.abs(this.chosenCollideWindowCenter.y)) /
          this.volumeRange;
        const avgVolume = (horizontalVolume + verticalVolume) / 2;
        return avgVolume < 0 ? 0 : avgVolume;
      } else {
        return 0;
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    document
      .querySelector(".block-wrapper")
      ?.addEventListener("scroll", this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCenterCoordinate);
    document
      .querySelector(".block-wrapper")
      ?.removeEventListener("scroll", this.onScroll);
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

      this.enterGameMode = true;

      await this.$nextTick();

      this.masonryInstance = Macy({
        container: document.querySelector(".block-container"),
        margin: 30,
        columns: 10
      });
    },
    chooseRandomBlock() {
      const count = this.blocks.length;
      if (count) {
        const chosenIndex = Math.floor(Math.random() * count);
        const blocks = document.querySelector(".block-container")?.children;
        if (blocks && chosenIndex >= 0) {
          this.chosenBlockIndex = chosenIndex;
          this.chosenBlock = blocks[chosenIndex];
          this.chosenBlockCoordinate = getElementCoordinate(this.chosenBlock);
        }
      }
    },
    updateCenterCoordinate() {
      this.centerCoordinate = getBlockCenterCoordinate();
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
