<script setup>
import ChainSelect from '../components/ChainSelect.vue'

</script>
<template>
    <el-card size="huge" class="transferCard" embedded hoverable title="tikBridge">
        <ChainSelect @child-event="handleChainID" />
      <el-divider />
      <el-input v-model="amount" placeholder="amount">
        <template #prefix>
          <el-icon :component="FlashOutline" />
        </template>
      </el-input>
      <el-divider />
      <el-input v-model="toAddress" placeholder="to">
        <template #prefix>
          <el-icon :component="FlashOutline" />
        </template>
      </el-input>
      <el-divider />
        <el-button @click="transfer" type="info"> Transfer </el-button>
        <el-button @click="open" type="info"> Transfer </el-button>
    </el-card>
</template>

<script>
import { FlashOutline } from '@vicons/ionicons5'
import { defineComponent } from "vue";
import { ethers, parseEther } from "ethers";
import {ElMessage} from "element-plus";
import { toRaw } from 'vue'
export default defineComponent({
  components: {

  },
  beforeMount() {
    this.connWallet();
  },
  data() {
    return {
      buttonText: 'Connect Wallet',
      mos:{ "97": "0x889e2959cf02eB3d5d854d3B3b93f73D8EE18878", "50001": "0x3d8d602D3628EfEfE95a4d47f89518453D0833ce", "80001": "0x2b7C560F4fC5B43d4Fa3aAC556f0FBf8500f6594"},
      provider: ethers.BrowserProvider,
      abi: [{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"bytes","name":"_to","type":"bytes"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_toChain","type":"uint256"}],"name":"transferOutToken","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      amount: null,
      toAddress: null,
      toChain: null,
      fromChain: null,
      token:{"97": "0x86b2315743b687aaD996E08d66AF02A63b82A4C9", '50001': "0xCC7A077aE8A32B7BDA8e7e6150198061a8530CA1", '80001': '0x876a651153A56C2e04CA88920E16F33076E38466'}
    }
  },
  setup() {
    return {
      FlashOutline,
    }
  },
  methods: {
    open() {
      ElMessage('thisaaaa')
    },
    async connWallet() {
        let provider;
        if (typeof window.ethereum == 'undefined') {
          console.log("metamask not install")
        }else {
          try {
            await window.ethereum.request({method: 'eth_requestAccounts'})
            provider = await new ethers.BrowserProvider(window.ethereum)
            const cid = await provider.send("eth_chainId");
            if (cid !== undefined) {
              this.provider = provider
              this.buttonText = "Connect";
            }
          } catch (error) {
            console.log("error: ", error)
          }
        }
      },
    async transfer() {
      console.log(this.toChain)
      console.log(this.toAddress)
      const prvd = toRaw(this.provider)
      const signer = await prvd.getSigner()
      try{
        const amount = parseEther(this.amount)
        console.log(amount)

        const contract = new ethers.Contract(this.mos[this.fromChain], this.abi, signer)
        await contract.transferOutToken(this.token[this.fromChain], this.toAddress, amount, parseInt(this.toChain))

      }catch (error) {
        console.log(error['message'])
        if (error['message'].includes("balance too low")) {
          window.$message.error("balance too low")
        } else if (error["message"].includes("value must be a string")){
          console.log(error)
          // window.$message.error("please input a right value")

        }
      }

    },
    handleChainID(chainID) {
      console.log(chainID)
      this.fromChain = chainID["fromChain"]
      this.toChain = chainID["toChain"]
    }
  }

})
</script>

<style>
@media (min-width: 1024px) {
  .transferCard {
    min-height: 50vh;
    width: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>