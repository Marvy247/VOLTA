import { cookieStorage, createStorage, http } from '@wagmi/core'
import { createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { injected } from 'wagmi/connectors'

// Define X1 EcoChain networks
// X1 EcoChain: Energy-efficient L1 (PoA) with ~3W nodes and ultra-low fees
export const x1EcoChain = defineChain({
  id: 204005,
  name: 'X1 EcoChain',
  nativeCurrency: { name: 'XN', symbol: 'XN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://204005.rpc.thirdweb.com'] },
    public: { http: ['https://x1-mainnet.xen.network'] },
  },
  blockExplorers: {
    default: { name: 'X1 Scan', url: 'https://maculatus-scan.x1eco.com' },
  },
})

export const x1Testnet = defineChain({
  id: 10778, // X1 Devnet/Testnet chain ID
  name: 'X1 Testnet',
  nativeCurrency: { name: 'XN', symbol: 'XN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://x1-testnet.xen.network'] },
  },
  blockExplorers: {
    default: { name: 'X1 Testnet Explorer', url: 'https://explorer.x1-testnet.xen.network' },
  },
  testnet: true,
})

export const networks = [x1EcoChain, x1Testnet]

// Set up the Wagmi Config for X1 EcoChain
export const config = createConfig({
  chains: [x1EcoChain, x1Testnet],
  connectors: [
    injected(),
  ],
  transports: {
    [x1EcoChain.id]: http(),
    [x1Testnet.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})
