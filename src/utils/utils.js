import { parseEther } from "ethers";

export function isAddress(address) {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(address);
}

export function checkInputValue(value) {
  try{
    const v = parseEther(value)
    if ( v.toString() === '0' ) {
      throw new Error('Invalid value: Cannot be 0');
    }
    return true
  }catch (error) {
    return false
  }
}