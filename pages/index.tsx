import abi from "../src/Lottery.json";
import { ethers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { Button, Divider, Typography } from "@mui/material";
import { Stack } from "@mui/system";

const contractAddress = "0x980fC4F6577B876a59fF0878B422EABf7B4beE2C"

export default function Home() {
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState("");

  const onEnteringLotterySystemBtnClick = async () => {
    let confirmed = confirm("Are you sure you want to entering the lottery system?")
    if (signer === null) return
    if (confirmed) {
      const lotteryContract = new ethers.Contract(
        contractAddress,
        abi.abi,
        signer
      );
      


      //we will call enter function and pass 0.1 ethers to it
      const transaction = await lotteryContract.enter({
        value: ethers.utils.parseEther("0.1"),
      })

      //wait the transaction to be mined
      await transaction.wait();

      alert("You have entered the lottery system!")
    } else {
      alert("You have not entered the lottery system")
    }
  }

  const getBalance = async () => {
    if (provider === null) return
    const lotteryContract = new ethers.Contract(
      contractAddress,
      abi.abi,
      provider
      );
      const balanceFromContract = await lotteryContract.getBalance();
      const decimalBalance = ethers.utils.formatEther(balanceFromContract)
      setBalance(decimalBalance)
  }

  const connectToTheMetaMask = useCallback(async () => {
    // check if the browser has MetaMask installed
    if (!(window as any).ethereum) {
      alert("Please install MetaMask first.");
      return;
    }
    // get the user's account address
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0]);
  }, []);

  const signer = useMemo(() => {
    if (!address) return null;
    return new ethers.providers.Web3Provider(
      (window as any).ethereum
    ).getSigner();
  }, [address]);
  
  const provider = useMemo(() => {
    // only connect to the contract if the user has MetaMask installed
    if (typeof window === "undefined") return null;
    return new ethers.providers.Web3Provider((window as any).ethereum);
  }, []);
  
  
  return (
    <>
    <h1>Home</h1>
    <h4>Address: {address}</h4>
    <h4>Balance: {balance}</h4>
    <button onClick={connectToTheMetaMask}>Connect to Metamask</button>
    <button onClick={getBalance}>Get balance</button>
    <Button onClick={onEnteringLotterySystemBtnClick}>Enter Lottery system</Button>
    </>
  )
}
