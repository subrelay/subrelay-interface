<template>
  <div class="menu-items">
    <template v-if="items.length">
      <button
        class="item"
        v-for="(item, index) in items"
        @click="selectItem(index)"
        :key="index"
        :class="{ 'is-selected': index === selectedIndex }"
      >
        {{ item.display }}
      </button>
    </template>
    <div class="item" v-else>No result</div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    };
  },

  watch: {
    items() {
      this.selectedIndex = 0;
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        this.downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler() {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length;
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    },

    enterHandler() {
      this.selectItem(this.selectedIndex);
    },

    selectItem(index) {
      const item = this.items[index];

      if (item) {
        this.command({ id: item });
      }
    },

    handleMouseEnter() {
      this.selectedIndex = null;
    },

    handleMouseLeave() {
      console.log('leave');
    },
  },

  mounted() {
    const element = document.querySelector('.menu-items');
    if (!element) return;
    element.addEventListener('mouseenter', this.handleMouseEnter);
    element.addEventListener('mouseleave', this.handleMouseLeave);
  },

  beforeUnmount() {
    const element = document.querySelector('.menu-items');
    if (!element) return;
    element.removeEventListener('mouseenter', this.handleMouseEnter);
    element.removeEventListener('mouseleave', this.handleMouseLeave);
  },
};
</script>

<style lang="scss">
.menu-items {
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  background: #fff;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
}

.item {
  display: block;
  margin: 0;
  width: 100%;
  text-align: left;
  background: transparent;
  border-radius: 3px;
  border: 1px solid transparent;
  padding: 0.2rem 0.4rem;

  &:hover {
    background: rgb(243, 243, 245);
  }

  &.is-selected {
  background: rgb(243, 243, 245);
  }
}
</style>
