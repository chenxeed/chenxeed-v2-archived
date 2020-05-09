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

function getBlockCenterCoordinate(domBlockWrapper: Element): Coordinate {
  const width = domBlockWrapper.clientWidth;
  const height = domBlockWrapper.clientHeight;
  const scrollX = domBlockWrapper.scrollLeft;
  const scrollY = domBlockWrapper.scrollTop;
  return {
    x: width / 2 + scrollX,
    y: height / 2 + scrollY
  };
}

function getElementCoordinate(
  domBlockWrapper: Element,
  elem: Element
): Coordinate {
  const bound = elem.getBoundingClientRect();
  const scrollX = domBlockWrapper.scrollLeft;
  const scrollY = domBlockWrapper.scrollTop;
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
      volumeRange: 2000,
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

      await this.$nextTick();

      this.masonryInstance = Macy({
        container: document.querySelector(".block-container"),
        margin: 30,
        columns: 20
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
          this.updateChosenBlockCoordinate();
        }
      }
      if (this.masonryInstance) {
        this.masonryInstance.on("macy.recalculated", () => {
          this.updateChosenBlockCoordinate();
        });
      }
    },
    updateCenterCoordinate() {
      this.centerCoordinate = getBlockCenterCoordinate(this.$refs.blockWrapper);
    },
    updateChosenBlockCoordinate() {
      if (this.chosenBlock) {
        this.chosenBlockCoordinate = getElementCoordinate(
          this.$refs.blockWrapper,
          this.chosenBlock
        );
      }
    },
    scrollToCenter() {
      const blockWrapper = this.$refs.blockWrapper as Element;
      const width = blockWrapper.scrollWidth;
      const height = blockWrapper.scrollHeight;
      blockWrapper.scrollLeft = width / 2;
      blockWrapper.scrollTop = height / 2;
    },
    async onClickGenerate() {
      this.enterGameMode = true;
      this.clearBlocks();
      await this.generateBlocks(500);
      this.chooseRandomBlock();
      this.scrollToCenter();
    },
    async onResize() {
      this.updateCenterCoordinate();
    },
    async onScroll() {
      this.updateCenterCoordinate();
    },
    onClickBlock(index: number) {
      if (index === this.chosenBlockIndex) {
        alert("Correct!");
        this.clearBlocks();
        this.enterGameMode = false;
      } else {
        alert("Try again!");
      }
    }
  }
});
