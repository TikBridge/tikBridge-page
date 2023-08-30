<template>
  <el-space vertical>
    <el-tag :bordered="false">FromChain</el-tag>
    <el-select
      v-model="fromChain"
      placeholder="From Chain" :options="options"
      @change="switchChain()"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-tag :bordered="false">ToChain</el-tag>
    <el-select
      v-model="toChain"
      placeholder="To Chain" :options="options"
      @change="emitValue"
    >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    </el-select>
  </el-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
export default defineComponent({
  components: {
  },
  setup () {
    return {
      fromChain: ref(null),
      toChain: ref(null),
      options: [
        {
          label: 'BSC TestNet',
          value: 97
        },
        {
          label: 'TKM TestNet',
          value: 50001
        }
      ],
    }
  },
  methods: {
    async switchChain() {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${this.fromChain.toString(16)}` }],
        })
        console.log('switched to the network: ', this.fromChain);
      }catch (error) {
        this.fromChain = null
        if (error['code'] == 4902) {
          this.addChain(this.fromChain)
        }else if (error['code'] === 4001){
          ElMessage.warning("User reject checkout network")
        } else {
          ElMessage.error('switch to the network error:', error);
        }
      }
      this.emitValue()
    },
    async addChain(chainID) {
      try{
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: `0x${chainID.toString(16)}`, chainName: 'X-Relay', rpcUrls: ['http://54.213.26.209:32016'] }],
        })
      }catch (error) {
        if (error['code'] == -32602) {
          ElMessage.error("try to add network error, Please add it manually")
        }
      }
    },
    emitValue() {
      let fromChain = 0
      let toChain = 0
      if (this.fromChain !== null ) {
        fromChain = this.fromChain
      }
      if (this.toChain !== null ) {
        toChain =  this.toChain
      }
      this.$emit('child-event', {"fromChain": fromChain.toString(), "toChain": toChain.toString()})
    }
  }
})
</script>
<style scoped>

</style>