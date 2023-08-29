<script setup>
import ChainSelect from '../components/ChainSelect.vue'
</script>
<template>
    <n-card size="huge" class="transferCard" embedded hoverable title="tikBridge">
      <n-message-provider>
        <n-dialog-provider>
        <ChainSelect @child-event="handleChainID" />
        </n-dialog-provider>
      </n-message-provider>
      <n-divider />
      <n-input v-model:value="amount" placeholder="amount">
        <template #prefix>
          <n-icon :component="FlashOutline" />
        </template>
      </n-input>
      <n-divider />
      <n-input v-model:value="toAddress" placeholder="to">
        <template #prefix>
          <n-icon :component="FlashOutline" />
        </template>
      </n-input>
      <n-divider />
      <n-button @click="transfer" type="info"> Transfer </n-button>
    </n-card>
</template>

<script>
import { FlashOutline } from '@vicons/ionicons5'
import { defineComponent } from "vue";
import { ethers, parseEther } from "ethers";
import { NCard, NIcon, NDivider,NDialogProvider, NMessageProvider, NButton, NInput } from 'naive-ui'
import { toRaw } from 'vue'
export default defineComponent({
  components: {
    NCard,
    NIcon,
    NInput,
    NButton,
    NDivider,
    NMessageProvider,
    NDialogProvider

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
      FlashOutline
    }
  },

  methods: {
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
      const prvd = toRaw(this.provider)
      console.log(prvd.getNetwork())
      const signer = await prvd.getSigner()
      const contract = new ethers.Contract(this.mos[this.fromChain], this.abi, signer)
      const amount = parseEther(this.amount)
      await contract.transferOutToken(this.token[this.fromChain], this.toAddress, amount, parseInt(this.toChain))

    },
    handleChainID(chainID) {
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