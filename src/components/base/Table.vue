<template>
  <div class="table-wrapper" :class="'table-' + tableName">
    <ul class="table-header">
      <li class="row title" :class="'row-title-' + tableName">
        <span class="col" v-for="(column, i) of columns" :key="i" :class="resolveColClass(column)" :style="{width: column.width}">{{ column.label }}</span>
      </li>
    </ul>
    <div class="body-container">
      <ul class="table-body">
        <li class="row" v-for="(row, i) of rows" :key="i" :class="[resolveRowClass(row, i)]" @click="rowClickHandler(row, i)">
          <span class="col" v-for="(column, i) of columns" :key="i" :class="resolveColClass(column, row, i)" :style="{width: column.width}">
            <slot :name="column.field" :row="row" :column="column">
              <span :title="row[column.field]" v-text="row[column.field]"></span>
            </slot>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableName: String,
    columns: Array,
    rows: Array,
    rowClassResolver: String | Function,
    colClassResolver: String | Function
  },
  data() {
    return { }
  },
  methods: {
    resolveRowClass(row, index) {
      let resolverType = typeof this.rowClassResolver
      switch (resolverType) {
        case 'function':
          return this.rowClassResolver(row, index)
        case 'string':
          return this.rowClassResolver
      }
    },
    resolveColClass(column, row, index) {
      let cls = ['col-' + column.field], resolver = this.colClassResolver
      let resolverType = typeof resolver
      switch (resolverType) {
        case 'function':
          cls.push(resolver(column, row, index) || '')
        case 'string':
          cls.push(resolver)
      }
      return cls
    },
    rowClickHandler(row, index) {
      this.$emit('row-click', row, index)
    },
    currentRowEl() {
      let ul = Array.from(this.$el.getElementsByTagName('ul')).filter(el => Array.from(el.classList).includes('table-body'))[0]
      if (ul) {
        return Array.from(ul.getElementsByClassName('current')).filter(li => li.tagName == 'LI')[0]
      }
    }
  }
}
</script>
<style>
/*
.table-wrapper {
  height: 95%;
}
*/
.body-container {
  flex: 1;
  overflow: auto;
}
ul {
  list-style-type: disc;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0;
}

ul li {
  list-style: none;
  padding: 0px;
  margin: 0px;
}

.row {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: stretch;
}
.row > .col {
  overflow: hidden;
}
</style>