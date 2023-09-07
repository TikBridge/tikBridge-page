<script setup>
import ChainSelect from '../components/ChainSelect.vue'
import TokenSelect from "@/components/TokenSelect.vue";
</script>
<template>
  <div class="transferpage">
    <div class="left">
      <p class="leftTitle">Wallet Info:</p>
      <p class="secondTitle">Networks:</p>
      <div class="rpcbox">
        <div v-for="cinfo in chaininfo" :key="cinfo.chainId" class="infos">
          <div class="transferpage">
            <p class="lineTitle">Name: </p>
            <p class="thirdTitle">{{ cinfo.chainName }}</p>
          </div>
          <div class="transferpage">
            <p class="lineTitle">ChainID: </p>
            <p class="thirdTitle">{{ parseInt(cinfo.chainId) }}</p>
          </div>
          <div class="transferpage">
            <p class="lineTitle">RPCURL: </p>
            <p class="thirdTitle">{{ cinfo.rpcUrls[0] }}</p>
          </div>
        </div>
      </div>
      <div class="senderbox">
        <p class="secondTitle">Sender:</p>
        <p class="thirdTitle">your metamask account</p>
      </div>
      <p class="leftTitle">Example:</p>
      <p>transfer from BBC(BNB Testnet) to TTC(Tkm Testnet)</p>
      <p>1. select FromChain BNB Testnet</p>
      <p>2. select ToChain Tkm Testnet</p>
      <p>3. select BNB Testnet Token BBC</p>
      <p>4. input transfer amount</p>
      <p>5. input transfer to(address in tochain)</p>
      <p>6. touch approve to set allowances to bridge contract</p>
      <p>7. touch transfer to submit transaction</p>
    </div>
    <div class="right">
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
          <el-button @click="openApprovedialog" type="primary" center> Approve </el-button>
          <el-button @click="openTransferdialog" type="primary" center> Transfer </el-button>
        </div>
      </el-card>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="TransferInfo"
      width="40%"
      center
    >
      <p>FromChain: {{fromChain}}</p>
      <el-divider />
      <p>ToChain: {{toChain}}</p>
      <el-divider />
      <p>token: {{token}}</p>
      <el-divider />
      <p>Amount: {{amount}}</p>
      <el-divider />
      <p>toAddress: {{toAddress}}</p>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeTransferdialog">Cancel</el-button>
        <el-button type="primary" @click="transfer">
          Send
        </el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogApprove"
      title="ApproveInfo"
      width="40%"
      center
    >
      <p>ChainID: {{fromChain}}</p>
      <el-divider />
      <p>token: {{token}}</p>
      <el-divider />
      <p>Your Address: {{fromAddress}}</p>
      <el-divider />
      <p>Approve To: {{mos[fromChain]}}</p>
      <el-divider />
      <p>Amount: {{amount}}</p>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeApprovedialog">Cancel</el-button>
        <el-button type="primary" @click="approveamount">
          Send
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import 'element-plus/es/components/message/style/css'
import { FlashOutline } from '@vicons/ionicons5'
import { defineComponent, ref } from "vue";
import { ethers, parseEther } from "ethers";
import { toRaw } from 'vue'
import { ElMessage } from "element-plus";
import { checkInputValue, isAddress } from "@/utils/utils";

export default defineComponent({
  components: {
  },
  beforeMount() {
    this.connWallet();
  },
  data() {
    return {
      mos:{ "5": "0x93997B4DD49adD584bC5da80F3FCFc8BcD4d89E6", "97": "0x889e2959cf02eB3d5d854d3B3b93f73D8EE18878", "50001": "0x3d8d602D3628EfEfE95a4d47f89518453D0833ce"},
      provider: ethers.BrowserProvider,
      abi: [
        {"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"bytes","name":"_to","type":"bytes"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_toChain","type":"uint256"}],"name":"transferOutToken","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
      ],
      chaininfo: [
        {chainId: '0x5', chainName: "Goerli", rpcUrls: ["https://rpc.ankr.com/eth_goerli"], nativeCurrency: {name: "ETH", symbol: 'ETH', decimals: 18}, blockExplorerUrls: ["https://goerli.etherscan.io"], iconUrls: []},
        {chainId: '0x61', chainName: "BNB TestNet", rpcUrls: ["https://bsc-testnet.publicnode.com"], nativeCurrency: {name: "tBNB", symbol: 'tBNB', decimals: 18}, blockExplorerUrls: ["https://testnet.bscscan.com/"], iconUrls: ["https://raw.githubusercontent.com/MetaMask/eth-contract-metadata/main/images/0x094616f0bdfb0b526bd735bf66eca0ad254ca81f/logo.png", "https://raw.githubusercontent.com/MetaMask/eth-contract-metadata/main/images/0x094616f0bdfb0b526bd735bf66eca0ad254ca81f/logo_large.png"]},
        {chainId: '0xc351', chainName: "TKM TestNet", rpcUrls: ["http://43.247.184.48:32021"], nativeCurrency: {name: "TKM", symbol: 'TKM', decimals: 18}, blockExplorerUrls: [], iconUrls: []}
      ],
      amount: null,
      toAddress: null,
      toChain: null,
      fromChain: null,
      token: null,
      fromAddress: null,
      tokens:{
        "5": [{label: "TGC", value: "0x9530513bA14FCa1b765F8f453A1b5385a4c0C2CC"}],
        "97": [{label: "BBC", value: "0x86b2315743b687aaD996E08d66AF02A63b82A4C9"}, {label: "BBT", value: "0xB2d3834396f65dbFbD390dE47c17111204341F71"}, {label: "BTGC", value: "0xE293C62A660ED3B3b1014705E643c8De9471cFAb"}],
        "50001": [{label: "TTC", value: "0xCC7A077aE8A32B7BDA8e7e6150198061a8530CA1"}, {label: "MBBT", value: "0x78EE0f0D791BC943d0AEcc46b391CF8E33c0b494"}, {label: "MTGC", value: "0x039838258A99701932bC0A3308070025FfF4b90f"}],
      },
      dialogVisible: ref(false),
      dialogApprove: ref(false),
      selectTokens: []
    }
  },
  setup() {
    return {
      FlashOutline,
    }
  },
  methods: {
    closeTransferdialog() {
      this.dialogVisible = false
    },
    openTransferdialog() {
      if (this.fromChain === '0' || this.fromChain === null ) {
        ElMessage.warning('please choose a from chain');
        return
      }
      if (this.toChain === '0' || this.toChain === null) {
        ElMessage.warning('please choose a to chain');
        return;
      }
      if (this.token === null ) {
        ElMessage.warning('please choose a transfer token');
        return;
      }
      if (this.toAddress=== null || !isAddress(this.toAddress)) {
        ElMessage.warning('please input a legal to address');
        return;
      }
      if (!checkInputValue(this.amount)) {
        ElMessage.warning('please input a legal to value and can not be 0');
        return;
      }
      this.dialogVisible = true
    },
    closeApprovedialog() {
      this.dialogApprove = false
    },
    async openApprovedialog() {
      const prvd = toRaw(this.provider)
      const signer = await prvd.getSigner()
      const fromAddress = await signer.getAddress()
      this.fromAddress = fromAddress.toString()
      if (this.fromChain === '0' || this.fromChain === null ) {
        ElMessage.warning('please choose a from chain');
        return
      }
      if (this.token === null ) {
        ElMessage.warning('please choose a transfer token');
        return;
      }
      if (!checkInputValue(this.amount)) {
        ElMessage.warning('please input a legal to value and can not be 0');
        return;
      }
      this.dialogApprove = true
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
        const result = await contract.transferOutToken(this.token, this.toAddress, amount, parseInt(this.toChain))
        console.log(result)
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
      this.closeTransferdialog()

    },
    async approveamount() {
      const prvd = toRaw(this.provider)
      const signer = await prvd.getSigner()
      try{
        const amount = parseEther(this.amount)
        const contract = new ethers.Contract(this.token, this.abi, signer)
        await contract.approve(this.mos[this.fromChain], amount)
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
      this.closeApprovedialog()

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
  .transferpage {
    display: flex;
  }
  .senderbox {
    display: flex;
    align-items: baseline;
  }
  .senderbox p {
    margin-right: 5px;
  }
  .rpcbox {
    display: flex;
    flex-wrap: wrap; /* 允许换行 */
    max-width: 700px;
  }
  .left {
    margin-right: 50px;
    flex: 2;
  }

  .infos{
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .leftTitle{
    font-size: 24px;
    font-weight: bold;
  }
  .secondTitle {
    font-size: 20px;
    font-weight: bold;
  }
  .thirdTitle {
    font-size: 14px;
    font-weight: normal;
  }
  .lineTitle {
    font-size: 14px;
    font-weight: bold;
  }
  .right {
    flex: 1;
  }
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
  .transferpage p {
    margin-right: 5px;
  }
}
</style>