import { useEffect, useState } from 'react'
import Caver from 'caver-js'
import './App.css'
import dotenv from 'dotenv';
dotenv.config();

interface Klaytn {
  on: (eventName: string, callback: () => void) => void;
  enable: () => Promise<Array<string>>;
  selectedAddress: string;
  networkVersion: number;
  publicConfigStore: Store;
}

interface State {
  isEnabled: boolean
  isUnlocked: boolean;
  networkVersion: number;
  onboardingcomplete: boolean;
}

interface Store {
  subscribe: (callback: () => void) => void;
  getState: () => State;
}

declare interface Window {
  klaytn?: Klaytn;
}

declare global {
  interface Window {
    klaytn: Klaytn;
  }
}

function App() {
  const [address, setAddress] = useState('');
	const [provider, setProvider] = useState<any>({});
	const caver = new Caver(provider);
  const contractAdresss = import.meta.env.VITE_CONTRACT_ADRESS;

  useEffect(() => {
    if (typeof window.klaytn !== 'undefined') { // 설치확인
      setProvider(window['klaytn'])
    }
  }, []);

  const connectWallet = async (): Promise<void> => {
    await provider.enable();
  }

  const transferKlay = async () => {
    caver.klay
        .sendTransaction({
          type: 'VALUE_TRANSFER',
          from: window.klaytn.selectedAddress,
          to: window.klaytn.selectedAddress,
          value: caver.utils.toPeb('1', 'KLAY'), // 1 클레이 전송
          gas: 8000000
        })
        .once('transactionHash', transactionHash => {
          console.log('txHash', transactionHash);
        })
        .once('receipt', receipt => {
          console.log('receipt', receipt);
        })
        .once('error', error => {
          console.log('error', error);
          alert("지불에 실패하셨습니다.");
        })
    }


  return (
    <div>
      <button onClick={() => connectWallet()}>connect{address}</button>
      <button onClick={() => transferKlay()}>transferKlay</button>
    </div>
  )
}

export default App
