<template>
  <div class="select-option" :class="{'disabled': disabled}" @click="chooseOptionHandler">
    <slot>
      <div class="select-option-item" :data-value="value" :title="label || text" v-text="label || text"></div>
    </slot>
  </div>
</template>
<script>
export default {
  props: ['label', 'value', 'text', 'disabled'],
  created() {
    typeof this.$parent.appendOption == 'function' && this.$parent.appendOption(this)
  },
  methods: {
    chooseOptionHandler() {
      !this.disabled && this.$parent.chooseOption(this)
    }
  }
}
</script>
<style>
.select-option {
  display: block;
  width: 12em;
  margin: 1pt;
  padding: 4pt;
}
.select-option-item {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.select-option.disabled {
  color: gray;
}
</style>