<template>
  <div class="select-element">
    <div class="select-box" @click="dropdown = !dropdown">
      <div class="select-content" v-text="option.label || option.text"></div>
      <div class="select-dropdown-btn"><v-icon name="angle-down"></v-icon></div>
    </div>
    <div class="select-list-wrapper" v-show="dropdown">
      <div class="bg-mask" @click="dropdown = false"></div>
      <div class="select-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {
      option: {},
      options: [],
      dropdown: false
    };
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    chooseOption(option) {
      this.option = option
      this.dropdown = false
      this.$emit('change', this.option.value)
    },
    appendOption(child) {
      this.findOption()
    },
    findOption() {
      this.$children.forEach(child => {
        this.value == child.value && this.chooseOption(child)
      })
    },
    dropdownHandler() {
      this.dropdown = !this.dropdown
    }
  }
};
</script>
<style scope>
.bg-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0);
  z-index: 10;
}
.select-element {
  display: inline-block;
  cursor: pointer;
}
.select-box {
  display: flex;
  align-items: stretch;
  margin: 4pt;
  height: 1em;
  line-height: 1em;
}
.select-content {
  flex: 1;
  text-align: left;
}
.select-dropdown-btn {
  flex: 0;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  height: 1em;
  width: 1em;
}
.select-list-wrapper {
  position: absolute;
  height: 0;
  border: none;
  padding: 0;
  margin: 0;
}
.select-list {
  display: block;
  position: relative;
  padding: 4pt;
  top: 4pt;
  text-align: left;
  border: solid 1pt rgba(255, 255, 255, 0.3);
  border-radius: 2pt;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>