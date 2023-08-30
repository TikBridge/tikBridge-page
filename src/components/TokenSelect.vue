<template>
  <el-space vertical>
    <el-select
      v-model="tokenAddress"
      placeholder="Token Address" :options="$attrs.childProp"
      @change="tokenValue"
    >
      <el-option
        v-for="item in $attrs.childProp"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  components: {
  },
  setup () {
    return {
      tokenAddress: ref(null),
    }
  },
  methods: {
    tokenValue() {
      this.$emit('child-event', this.tokenAddress)
    }
  }
})
</script>
<style scoped>

</style>