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
          label: 'X-Relay TestNet',
          value: 80001
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
        if (error['code'] == 4902) {
          this.addChain(this.fromChain)
        }else {
          console.error('switch to the network error:', error);
        }
      }

    },
    async addChain(chainID) {
      try{
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: `0x${chainID.toString(16)}`, chainName: 'X-Relay', rpcUrls: ['http://54.213.26.209:32016'] }],
        })
      }catch (error) {
        if (error['code'] == -32602) {
          this.handleError("try to add network error, rpcurl must is a https url")
        }
      }
    },
    emitValue() {
      this.$emit('child-event', {"fromChain": this.fromChain.toString(), "toChain": this.toChain.toString()})
    }
  }
})
</script>
<style scoped>

</style>