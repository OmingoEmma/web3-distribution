'use client';

import { useEffect, useState } from 'react';

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    if ((window as any).ethereum) {
      setIsConnected(true);
      setAddress('0x1234...ABCD');
      return true;
    }
    alert('Wallet not found. Please install MetaMask.');
    return false;
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  return { isConnected, address, connect, disconnect };
}

export function useContracts() {
  const distributeRevenue = async (projectId: string, amount: number) => {
    await new Promise((r) => setTimeout(r, 500));
    console.log('Simulated distributeRevenue', { projectId, amount });
    return { txHash: '0xSIMULATED' };
  };

  const getProject = async (projectId: string) => {
    await new Promise((r) => setTimeout(r, 200));
    return { projectId };
  };

  return { distributeRevenue, getProject };
}


