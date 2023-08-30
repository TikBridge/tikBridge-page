<script setup>
import ChainSelect from '../components/ChainSelect.vue'
import TokenSelect from "@/components/TokenSelect.vue";
</script>
<template>
  <el-card size="huge" class="transferCard" embedded hoverable title="tikBridge">
      <ChainSelect @child-event="handleChainID" />
    <el-divider />
    <TokenSelect :childProp="selectTokens" @child-event="getTokenAddress"/>
    <el-divider />
    <div class="tag-input-row">
    <el-tag :bordered="false" >Amount</el-tag>
    <el-input v-model="amount" placeholder="amount" />
    </div>
    <el-divider />
    <div class="tag-input-row">
      <el-tag :bordered="false" >ToAddress</el-tag>
      <el-input v-model="toAddress" placeholder="to" />
    </div>

    <el-divider />
    <div class="transbtn">
      <el-button @click="this.showTransferInfo = true" type="primary" center> Transfer </el-button>
    </div>
  </el-card>
  <el-dialog
    v-model="showTransferInfo"
    title="TransferInfo"
    width="40%"
    center
  >
    <p>FromChain: {{this.fromChain}}</p>
    <el-divider />
    <p>ToChain: {{this.toChain}}</p>
    <el-divider />
    <p>token: {{this.token}}</p>
    <el-divider />
    <p>Amount: {{this.amount}}</p>
    <el-divider />
    <p>toAddress: {{this.toAddress}}</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="this.showTransferInfo = false">Cancel</el-button>
        <el-button type="primary" @click="this.transfer">
          Send
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import 'element-plus/es/components/message/style/css'
import { FlashOutline } from '@vicons/ionicons5'
import { defineComponent, ref } from "vue";
import { ethers, parseEther } from "ethers";
import { toRaw } from 'vue'
import { ElMessage } from "element-plus";

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
      showTransferInfo: ref(false),
      token: null,
      tokens:{
        "97": [{label: "BBC", value: "0x86b2315743b687aaD996E08d66AF02A63b82A4C9"}, {label: "BBT", value: "0xB2d3834396f65dbFbD390dE47c17111204341F71"}],
        "50001": [{label: "TTC", value: "0xCC7A077aE8A32B7BDA8e7e6150198061a8530CA1"}, {label: "MBBT", value: "0x78EE0f0D791BC943d0AEcc46b391CF8E33c0b494\n"}],
        "80001": [{label: "TBC", value: "0x876a651153A56C2e04CA88920E16F33076E38466"}, {label: "RBBT", value: "0x571eC3D07e3b44dc9576bc56BBBc903E6Df7e7dF\n"}]
      },
      selectTokens: []
    }
  },
  setup() {
    return {
      FlashOutline,
      dialogVisible: ref(false)
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
            ElMessage.error("connect wallet error")
            console.log("error: ", error)
          }
        }
      },
    async transfer() {
      const prvd = toRaw(this.provider)
      const signer = await prvd.getSigner()
      try{
        const amount = parseEther(this.amount)
        console.log("fromChain: ", this.fromChain)
        console.log("toChain: ", this.toChain)
        console.log("token: ", this.token)
        console.log("amount: ", amount)
        console.log("to: ", this.toAddress)
        const contract = new ethers.Contract(this.mos[this.fromChain], this.abi, signer)
        await contract.transferOutToken(this.token, this.toAddress, amount, parseInt(this.toChain))
      }catch (error) {
        if (error['message'].includes("balance too low")) {
          ElMessage.error("balance too low")
        } else if (error["message"].includes("value must be a string")){
          ElMessage.error("please input a right value")
        }else if (error['message'].includes("invalid value for Contract target")) {
          ElMessage.error('invalid argument')
        }else if (error['message'].includes("token not registered")) {
          ElMessage.error("token not registered")
        }else {
          console.log(error)
        }
      }
      this.showTransferInfo = false

    },
    handleChainID(chainID) {
      this.fromChain = chainID["fromChain"]
      this.toChain = chainID["toChain"]
      this.selectTokens = this.tokens[this.fromChain]
    },
    getTokenAddress(tokenAddress) {
      this.token = tokenAddress
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
  .tag-input-row {
    display: flex;
    align-items: center;
  }
  .tag-input-row .el-tag {
    margin-right: 10px;
  }
  .transbtn {
    text-align: center;
  }
}
</style>