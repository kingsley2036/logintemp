<template>
  <div class="search-element">
    <div class="search-box">
      <div class="search-content">
        <input class="search-input" :value="value" @input="$emit('change', $event.target.value)">
        <div class="clear-btn-wrapper">
          <slot v-if="!!value && showClearButton" name="clear-button">
            <button type="button" class="clear-btn" @click="clearValueHandler">
              <i class="icon-clear"><v-icon name="times"></v-icon></i>
            </button>
          </slot>
        </div>
      </div>
      <slot name="button">
        <button type="button" class="search-btn" @click="$emit('do-search', value)">
          <!-- <i class="icon-search"></i> -->
          <div class="search-icon-box">
            <v-icon class="search-icon" name="search" scale="1.2"></v-icon>
          </div>
        </button>
      </slot>
    </div>
    <div class="search-list-wrapper" v-show="dropdown">
      <div class="bg-mask" @click="dropdown = false"></div>
      <div class="search-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {
      option: {},
      showClearButton: true,
      dropdown: false
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  mounted() {
    this.$children.forEach(child => {
      console.log(`>> check choose entry: ${this.value}:${child.value}`)
      if (this.value == child.value) {
        this.option = child;
      }
    });
  },
  watch: {
    value() {
      this.dropdown = !!this.value
    }
  },
  methods: {
    clearValueHandler() {
      this.value = ''
    },
    chooseOption(option) {
      this.option = option
      this.$emit("change", this.option.value)
      this.$nextTick(() => this.dropdown = false)
    },
    dropdownHandler() {
      this.dropdown = !this.dropdown;
    }
  }
};
</script>
<style scoped>
.search-box {
  display: flex;
  align-items: stretch;
  background-color: white;
  font-size: 16pt;
  width: 200pt;
}
.search-content {
  flex: 1;
  text-align: left;
  display: flex;
  align-items: center;
  background: #e0e0e0;
  padding: 0 6pt;
}
.search-content input {
  border: none;
  flex: 1;
  background: transparent;
}
.clear-btn-wrapper {
  display: flex;
  width: 0;
  position: relative;
  left: -16pt;
}
button.clear-btn {
  display: inline-block;
  border: none;
  /* background-color: rgba(0, 0, 0,0.2); */
  border-radius: 16pt;
  padding: 0;
}
i.icon-clear {
  display: inline-block;
  margin: 0;
  padding: 0;
  font-style: normal;
  width: 12pt;
  height: 12pt;
}
button.search-btn {
  display: flex;
  padding: 0;
  border: none;
  background-color: #0b4e92;
}
.search-icon-box {
  /* background: url(../../assets/images/flag-search-2.png) no-repeat center; */
  /* background-size: 60%; */
  color: white;
  display: flex;
  height: 24pt;
  width: 24pt;
}
.search-icon {
  margin: auto;
}

.search-element {
  display: inline-block;
  cursor: pointer;
}
.search-dropdown-btn {
  flex: 0;
  cursor: pointer;
  height: 1em;
  width: 1em;
}
.search-list-wrapper {
  position: absolute;
  height: 0;
  border: none;
  padding: 0;
  margin: 0;
}
.search-list {
  display: block;
  position: relative;
  padding: 4pt;
  top: 4pt;
  font-size: 10pt;
  text-align: left;
  background-color: #e0e0e0;
  z-index: 100;
}
</style>