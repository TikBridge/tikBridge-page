<template>
  <el-space vertical>
    <el-tag :bordered="false">FromChain</el-tag>
    <el-select
      v-model="fromChain"
      placeholder="From Chain"
      :options="options"
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
    <el-select v-model="toChain" placeholder="To Chain" :options="options" @change="emitValue">
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
import { defineComponent, ref, toRaw } from 'vue'
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
          label: 'BNB TestNet',
          value: 97
        },
        {
          label: 'TKM TestNet',
          value: 50001
        }
      ],
    }
  },
  data () {
    return {
      chaininfo: {
        97: {chainId: '0x61', chainName: "BNB TestNet", rpcUrls: ["https://bsc-testnet.publicnode.com"], nativeCurrency: {name: "tBNB", symbol: 'tBNB', decimals: 18}, blockExplorerUrls: ["https://testnet.bscscan.com/"], iconUrls: ["https://raw.githubusercontent.com/MetaMask/eth-contract-metadata/main/images/0x094616f0bdfb0b526bd735bf66eca0ad254ca81f/logo.png", "https://raw.githubusercontent.com/MetaMask/eth-contract-metadata/main/images/0x094616f0bdfb0b526bd735bf66eca0ad254ca81f/logo_large.png"]},
        50001: {chainId: '0xc351', chainName: "TKM TestNet", rpcUrls: ["http://43.247.184.48:32021"], nativeCurrency: {name: "TKM", symbol: 'TKM', decimals: 18}, blockExplorerUrls: [], iconUrls: []}
      }
    }

  },
  methods: {
    async switchChain() {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: this.chaininfo[this.fromChain].chainId}],
        })
        console.log('switched to the network: ', this.fromChain);
      }catch (error) {
        const chainid = this.fromChain
        this.fromChain = null
        console.log(error['message'])
        if (error['message'].includes("Try adding the chain")) {
          await this.addChain(chainid)
        }else if (error['code'] === 4001){
          ElMessage.warning("User reject checkout network")
        } else {
          ElMessage.error('switch to the network error:', error);
        }
      }
      this.emitValue()
    },
    async addChain(chainID) {
      try {
        const chaininfo = toRaw(this.chaininfo[chainID])
        console.log(chaininfo)
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chaininfo],
        })
        this.fromChain = chainID
      } catch (error) {
        if (error['code'] == -32602) {
          console.log(error['message'])
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
<style scoped></style>