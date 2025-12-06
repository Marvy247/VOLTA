import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useContracts } from './useContracts';
import { formatEther } from 'viem';

export function useEnergy() {
  const { address } = useAccount();
  const { energyToken } = useContracts();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    if (!address || !energyToken) {
      setBalance(0);
      return;
    }

    setIsLoading(true);
    try {
      const result = await energyToken.read.balanceOf([address]);
      const balanceInEther = parseFloat(formatEther(result));
      setBalance(balanceInEther);
    } catch (error) {
      console.error('Error fetching energy balance:', error);
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    // Poll every 10 seconds for balance updates
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [address, energyToken]);

  return {
    balance,
    isLoading,
    refetch: fetchBalance,
  };
}
