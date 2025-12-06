import { createPublicClient, http, Block, Transaction, formatEther, formatGwei } from 'viem';
import { defineChain } from 'viem';

// Define X1 EcoChain Network
// Energy-efficient L1 blockchain with Proof of Authority (PoA) consensus
// ~3W power consumption per node, ultra-low fees, ~7.5s block time
export const x1EcoChain = defineChain({
  id: 204005,
  name: 'X1 EcoChain',
  network: 'x1-ecochain',
  nativeCurrency: {
    decimals: 18,
    name: 'XN',
    symbol: 'XN',
  },
  rpcUrls: {
    default: {
      http: ['https://204005.rpc.thirdweb.com'],
    },
    public: {
      http: ['https://x1-mainnet.xen.network'],
    },
  },
  blockExplorers: {
    default: { name: 'X1 Scan', url: 'https://maculatus-scan.x1eco.com' },
  },
});

// Define X1 Testnet (Devnet)
export const x1Testnet = defineChain({
  id: 10778,
  name: 'X1 Testnet',
  network: 'x1-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XN',
    symbol: 'XN',
  },
  rpcUrls: {
    default: {
      http: ['https://x1-testnet.xen.network'],
    },
    public: {
      http: ['https://x1-testnet.xen.network'],
    },
  },
  blockExplorers: {
    default: { name: 'X1 Testnet Explorer', url: 'https://explorer.x1-testnet.xen.network' },
  },
});

// Create public client for X1 EcoChain
export const publicClient = createPublicClient({
  chain: x1EcoChain,
  transport: http('https://204005.rpc.thirdweb.com', {
    batch: true,
    timeout: 30_000,
  }),
});

// Create testnet client
export const testnetClient = createPublicClient({
  chain: x1Testnet,
  transport: http('https://x1-testnet.xen.network', {
    batch: true,
    timeout: 30_000,
  }),
});

// Blockchain Service Functions for X1 EcoChain

export class X1BlockchainService {
  private client: ReturnType<typeof createPublicClient>;

  constructor(useTestnet = false) {
    this.client = useTestnet ? testnetClient : publicClient;
  }

  async getLatestBlock(): Promise<Block> {
    return await this.client.getBlock({ includeTransactions: true });
  }

  async getBlockNumber(): Promise<bigint> {
    return await this.client.getBlockNumber();
  }

  async getBlock(blockNumber: bigint): Promise<Block> {
    return await this.client.getBlock({ 
      blockNumber,
      includeTransactions: true 
    });
  }

  async getTransaction(hash: `0x${string}`): Promise<Transaction> {
    return await this.client.getTransaction({ hash });
  }

  async getGasPrice(): Promise<bigint> {
    return await this.client.getGasPrice();
  }

  async getBalance(address: `0x${string}`): Promise<bigint> {
    return await this.client.getBalance({ address });
  }

  async getCode(address: `0x${string}`): Promise<string> {
    return await this.client.getBytecode({ address }) || '0x';
  }

  async getTransactionCount(address: `0x${string}`): Promise<number> {
    return await this.client.getTransactionCount({ address });
  }

  async getTransactionReceipt(hash: `0x${string}`) {
    return await this.client.getTransactionReceipt({ hash });
  }

  // Calculate TPS from recent blocks
  async calculateTPS(blocksToAnalyze = 10): Promise<number> {
    try {
      const latestBlockNumber = await this.getBlockNumber();
      const blocks = await Promise.all(
        Array.from({ length: blocksToAnalyze }, (_, i) =>
          this.getBlock(latestBlockNumber - BigInt(i))
        )
      );

      const totalTransactions = blocks.reduce(
        (sum, block) => sum + (block.transactions?.length || 0),
        0
      );

      const oldestBlock = blocks[blocks.length - 1];
      const newestBlock = blocks[0];
      const timeSpan = Number(newestBlock.timestamp - oldestBlock.timestamp);

      return timeSpan > 0 ? totalTransactions / timeSpan : 0;
    } catch (error) {
      console.error('Error calculating TPS:', error);
      return 0;
    }
  }

  // Get network metrics
  async getNetworkMetrics() {
    try {
      const [blockNumber, gasPrice, latestBlock] = await Promise.all([
        this.getBlockNumber(),
        this.getGasPrice(),
        this.getLatestBlock(),
      ]);

      const tps = await this.calculateTPS(20);

      return {
        blockNumber: Number(blockNumber),
        gasPrice: formatGwei(gasPrice),
        latestBlockTimestamp: Number(latestBlock.timestamp),
        transactionCount: latestBlock.transactions?.length || 0,
        tps: tps.toFixed(2),
        blockSize: latestBlock.size ? Number(latestBlock.size) : 0,
      };
    } catch (error) {
      console.error('Error fetching network metrics:', error);
      throw error;
    }
  }

  // Analyze contract bytecode
  async analyzeContract(address: `0x${string}`) {
    try {
      const [code, txCount, balance] = await Promise.all([
        this.getCode(address),
        this.getTransactionCount(address),
        this.getBalance(address),
      ]);

      const isContract = code !== '0x' && code.length > 2;
      const codeSize = isContract ? (code.length - 2) / 2 : 0; // bytes

      return {
        address,
        isContract,
        codeSize,
        bytecode: code,
        transactionCount: txCount,
        balance: formatEther(balance),
      };
    } catch (error) {
      console.error('Error analyzing contract:', error);
      throw error;
    }
  }

  // Get recent transactions
  async getRecentTransactions(count = 10) {
    try {
      const latestBlock = await this.getLatestBlock();
      const transactions: any[] = [];

      if (latestBlock.transactions) {
        const txs = latestBlock.transactions.slice(0, count);
        
        for (const tx of txs) {
          if (typeof tx !== 'string') {
            const receipt = await this.getTransactionReceipt(tx.hash);
            transactions.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to || null,
              value: formatEther(tx.value || 0n),
              gas: tx.gas ? Number(tx.gas) : 0,
              gasPrice: tx.gasPrice ? formatGwei(tx.gasPrice) : '0',
              blockNumber: Number(tx.blockNumber),
              status: receipt?.status === 'success' ? 'success' : 'failed',
              type: tx.to ? 'transfer' : 'contract',
            });
          }
        }
      }

      return transactions;
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  // Get historical block data for performance charts
  async getHistoricalBlocks(count = 24) {
    try {
      const latestBlockNumber = await this.getBlockNumber();
      const blocks: Block[] = [];
      
      // Sample blocks at intervals for efficiency
      const interval = Math.floor(100 / count); // Sample every ~100 blocks
      
      for (let i = 0; i < count; i++) {
        const blockNumber = latestBlockNumber - BigInt(i * interval);
        if (blockNumber > 0n) {
          const block = await this.getBlock(blockNumber);
          blocks.push(block);
        }
      }

      return blocks.reverse();
    } catch (error) {
      console.error('Error fetching historical blocks:', error);
      return [];
    }
  }

  // Calculate average block time
  async getAverageBlockTime(blocksToAnalyze = 100): Promise<number> {
    try {
      const latestBlockNumber = await this.getBlockNumber();
      const [latestBlock, olderBlock] = await Promise.all([
        this.getBlock(latestBlockNumber),
        this.getBlock(latestBlockNumber - BigInt(blocksToAnalyze)),
      ]);

      const timeDiff = Number(latestBlock.timestamp - olderBlock.timestamp);
      return timeDiff / blocksToAnalyze;
    } catch (error) {
      console.error('Error calculating average block time:', error);
      return 0;
    }
  }
}

// Singleton instance
export const x1Service = new X1BlockchainService(false);
export const x1TestnetService = new X1BlockchainService(true);
