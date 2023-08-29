<template>
  <n-space vertical>
    <n-tag :bordered="false">FromChain</n-tag>
    <n-select
      v-model:value="fromChain"
      placeholder="From Chain" :options="options"
      @update:value="switchChain()"
    />
    <n-tag :bordered="false">ToChain</n-tag>
    <n-select
      v-model:value="toChain"
      placeholder="To Chain" :options="options"
      @update:value="emitValue"
    />
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NSelect, NSpace, NTag, useMessage, useDialog } from 'naive-ui'
export default defineComponent({
  components: {
    NSelect,
    NSpace,
    NTag
  },
  setup () {
    const message = useMessage()
    const dialog = useDialog()
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
      handleError (context) {
        message.error(context)
      }
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