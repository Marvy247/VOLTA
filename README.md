# ⚡ VOLTA - The Energy Empire Game

<div align="center">

![VOLTA Banner](https://img.shields.io/badge/VOLTA-The%20Energy%20Empire%20Game-00C58E?style=for-the-badge)

**Build. Battle. Electrify.**

[![X1 EcoChain](https://img.shields.io/badge/Built%20For-X1%20EcoChain-00C58E)](https://x1ecochain.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-orange)](https://threejs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

*The first blockchain strategy game where renewable energy dominates*

[Play Game](#-quick-start) • [Documentation](#-documentation) • [Smart Contracts](#-smart-contracts) • [Grant Application](#-grant-application)

</div>

---

## 🎮 What is VOLTA?

**VOLTA** is a groundbreaking multiplayer strategy game built on **X1 EcoChain** where players build renewable energy empires, conquer territories, and battle for dominance on a shared blockchain-powered world map.

Named after **Alessandro Volta**, the inventor of the battery, VOLTA brings energy generation to the blockchain - where every solar panel, wind turbine, and hydro dam generates real tokens that fuel your conquest.

### 🌟 Core Gameplay

- **🗺️ Conquer Territories** - Claim hexagonal tiles on a persistent world map
- **⚡ Generate Energy** - Build solar panels, wind turbines, and hydro dams
- **🔋 Earn Passively** - Generate ENERGY tokens every block (~7.5 seconds)
- **⚔️ Battle Enemies** - Attack neighboring territories to expand your empire
- **🤝 Form Alliances** - Team up with other players for coordinated conquest
- **🏆 Dominate Leaderboards** - Climb rankings for daily, weekly, and all-time supremacy

---

## 🚀 Why VOLTA is Revolutionary

### 💎 Only Possible on X1 EcoChain

| Feature | VOLTA on X1 | Other Chains |
|---------|-------------|--------------|
| **Transaction Cost** | ~$0.01 per action | $5-50+ (Ethereum) |
| **Actions Per Day** | 20+ affordable | 1-2 (too expensive) |
| **Block Finality** | ~7.5s (instant) | 12s+ (slow) |
| **Energy Theme** | ✅ Perfect fit | ❌ No alignment |
| **Playability** | ✅ Real-time | ❌ Prohibitively expensive |

**Result:** VOLTA is literally impossible to play on any other blockchain due to gas costs. X1's ultra-low fees (~$0.01) make true blockchain gaming viable for the first time.

### 🌿 Green Gaming Narrative

- **Energy-Efficient Blockchain**: X1's PoA nodes consume only ~3W
- **Renewable Energy Theme**: Build solar, wind, hydro - not fossil fuels
- **Sustainability Focus**: First blockchain game with genuine eco-credentials
- **ESG Alignment**: Attracts environmentally-conscious gamers and investors

---

## 🎯 Game Mechanics Deep Dive

### 🏗️ Building System

Build and upgrade 6 types of structures on your territories:

| Building | Type | Cost | Generation | Defense | Max Level |
|----------|------|------|------------|---------|-----------|
| ☀️ **Solar Panel** | Energy | 100 ENERGY | +10/block | - | 10 |
| 💨 **Wind Turbine** | Energy | 250 ENERGY | +25/block | - | 10 |
| 💧 **Hydro Dam** | Energy | 500 ENERGY | +50/block | - | 10 |
| 🛡️ **Defense Tower** | Defense | 300 ENERGY | - | +50 | 8 |
| 🔒 **Shield Generator** | Defense | 400 ENERGY | - | +100 | 5 |
| 📦 **Energy Storage** | Utility | 150 ENERGY | - | +1000 capacity | 15 |

**Upgrade Mechanics:**
- Cost increases by 1.5x per level
- Higher levels = exponentially better returns
- Strategic placement matters

### ⚔️ Combat System

**Attack Mechanics:**
- **Attack Cost**: 50 ENERGY per attack
- **Cooldown**: 5 minutes between attacks
- **Range**: Attack territories within 3 hexes
- **Success Formula**: `Attack Power > Defense Power = Victory`

**Victory Rewards:**
- **Territory Transfer**: Conquer the territory
- **Energy Loot**: Steal 20% of defender's energy balance
- **Power Score**: Gain ranking points

### 👥 Alliance System

**Create Guilds:**
- **Creation Cost**: 1,000 ENERGY
- **Max Members**: 50 players per alliance
- **Leadership**: Transferable, democratic or autocratic
- **Benefits**: Coordinated attacks, shared defense, social features

---

## 🛠️ Technical Architecture

### Frontend Stack

```
Framework:     Next.js 16 (App Router) + React 19
Language:      TypeScript 5
3D Graphics:   Three.js + React Three Fiber
Styling:       Tailwind CSS 4 + shadcn/ui
State:         Zustand + Immer (persistent)
Blockchain:    wagmi + viem + RainbowKit
Real-time:     Socket.io (planned)
Animations:    Framer Motion
```

### Smart Contract Stack

```
Language:      Solidity 0.8.24
Framework:     Foundry
Testing:       Forge + Foundry
Libraries:     OpenZeppelin Contracts v5.5
Network:       X1 EcoChain (PoA)
Chain ID:      204005 (mainnet), 202212 (testnet)
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    VOLTA Frontend                        │
│                  (Next.js + Three.js)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼───────┐            ┌────────▼────────┐
│   X1 RPC      │            │  Caching Layer  │
│   Integration │            │  (Zustand +     │
│   (viem)      │            │   LocalStorage) │
└───────┬───────┘            └────────┬────────┘
        │                             │
        │        ┌────────────────────┘
        │        │
┌───────▼────────▼──────────────────────────────┐
│   X1 EcoChain Blockchain                      │
│   ┌──────────────┐  ┌──────────────┐         │
│   │ TerritoryNFT │  │ EnergyToken  │         │
│   │  (ERC-721)   │  │  (ERC-20)    │         │
│   └──────────────┘  └──────────────┘         │
│   ┌──────────────┐  ┌──────────────┐         │
│   │   Building   │  │    Battle    │         │
│   └──────────────┘  └──────────────┘         │
│   ┌──────────────┐                            │
│   │   Alliance   │                            │
│   └──────────────┘                            │
└───────────────────────────────────────────────┘
```

---

## 📦 Smart Contracts

### Contract Overview

| Contract | Type | Purpose | Status |
|----------|------|---------|--------|
| **TerritoryNFT** | ERC-721 | Land ownership, hex coordinates | ✅ Ready |
| **EnergyToken** | ERC-20 | Game currency, 10B max supply | ✅ Ready |
| **Building** | Logic | Build/upgrade structures | ✅ Ready |
| **Battle** | Logic | Combat system, territory conquest | ✅ Ready |
| **Alliance** | Social | Guild management, teams | ✅ Ready |

### Key Contract Functions

#### TerritoryNFT.sol
```solidity
// Claim a new territory
function claimTerritory(address to, int256 x, int256 y) external returns (uint256)

// Get all territories owned by a player
function getTerritoriesByOwner(address owner) external view returns (uint256[])
```

#### Building.sol
```solidity
// Build a new structure
function buildBuilding(uint256 territoryId, BuildingType buildingType) external returns (uint256)

// Collect generated energy
function collectEnergy(uint256 territoryId) external

// Upgrade existing building
function upgradeBuilding(uint256 buildingId) external
```

#### Battle.sol
```solidity
// Attack another territory
function attack(uint256 attackerTerritoryId, uint256 defenderTerritoryId) external returns (uint256)

// Check attack cooldown
function canAttack(address attacker) external view returns (bool, uint256)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible Web3 wallet
- X1 EcoChain added to wallet

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/volta.git
cd volta

# Install dependencies
cd app
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Adding X1 EcoChain to MetaMask

```
Network Name:     X1 EcoChain
RPC URL:          https://204005.rpc.thirdweb.com
Chain ID:         204005
Currency Symbol:  XN
Block Explorer:   https://maculatus-scan.x1eco.com
```

---

## 🎮 How to Play

### Step 1: Connect Wallet
- Visit [http://localhost:3000](http://localhost:3000)
- Click "Connect Wallet"
- Approve connection with MetaMask

### Step 2: Claim Your First Territory
- Navigate the 3D hex map (pan, zoom, rotate)
- Click an unclaimed (gray) hex tile
- Click "Claim Territory" (costs 50 ENERGY)
- Confirm the transaction

### Step 3: Build Energy Generators
- Click your owned territory
- Click "Build Structure"
- Select Solar Panel, Wind Turbine, or Hydro Dam
- Confirm transaction

### Step 4: Collect Energy
- Wait for energy to generate (~7.5s per block)
- Click your territory
- Click "Collect Energy"
- Receive ENERGY tokens to your wallet

### Step 5: Expand Your Empire
- Use energy to claim more territories
- Build defenses to protect from attacks
- Attack neighbors to steal their land
- Form alliances for coordinated conquest

---

## 📊 Transaction Volume Economics

### Per Player Per Day (Conservative)

| Action | Transactions | Cost per tx | Daily Cost |
|--------|--------------|-------------|------------|
| Collect Energy | 5 | $0.01 | $0.05 |
| Build/Upgrade | 3 | $0.01 | $0.03 |
| Attack Territories | 5 | $0.01 | $0.05 |
| Defend/Manage | 2 | $0.01 | $0.02 |
| Trade Resources | 3 | $0.01 | $0.03 |
| Alliance Actions | 2 | $0.01 | $0.02 |
| **TOTAL** | **20** | **$0.01** | **$0.20** |

**Ecosystem Impact:**
- 500 active players = **10,000 transactions/day**
- 1,000 active players = **20,000 transactions/day**
- **Minimal cost** = High engagement possible

---

## 🏆 Grant Application (X1 EcoChain)

### Program Details

- **Program**: X1 EcoChain $5M Grant Program
- **Track**: Consumer/Social/Gaming
- **Amount Requested**: $75,000
- **Timeline**: 120 days
- **Status**: ✅ Ready to Submit

### Why VOLTA Deserves Funding

#### ✅ Perfect Grant Criteria Match

| Criterion | VOLTA Score | Evidence |
|-----------|-------------|----------|
| **Category Fit** | 10/10 | Gaming track, high transaction volume |
| **90-120 Day Timeline** | 10/10 | 90% complete, realistic roadmap |
| **On-Chain Activity** | 10/10 | 10K+ transactions/day target |
| **X1 Alignment** | 10/10 | Energy theme, leverages X1 advantages |
| **Measurable KPIs** | 10/10 | DAU, txns, territories, NFT volume |
| **Security** | 9/10 | OpenZeppelin, audits planned |
| **Unique Value** | 10/10 | Only possible on X1 |

#### 🎯 Success Metrics

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Daily Active Users | 50 | 200 | 500 | 1,000+ |
| Transactions/Day | 1,000 | 5,000 | 10,000 | 25,000+ |
| Territories Claimed | 500 | 2,000 | 5,000 | 10,000+ |
| NFT Trading Volume | $1K | $10K | $50K | $200K+ |
| Alliances Created | 5 | 20 | 50 | 100+ |

---

## 📂 Project Structure

```
volta/
├── app/                        # Next.js Game Application
│   ├── src/
│   │   ├── game/              # Game-specific code
│   │   │   ├── components/    # React components (HexMap, GameHUD, etc.)
│   │   │   ├── hooks/         # Blockchain hooks (useTerritory, useEnergy)
│   │   │   ├── store/         # Zustand state management
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   ├── utils/         # Utilities (hexGrid math)
│   │   │   └── constants/     # Game configuration
│   │   ├── app/
│   │   │   ├── game/          # Game page route
│   │   │   └── layout.tsx     # Root layout
│   │   └── components/ui/     # shadcn/ui components
│   ├── config/                # Wagmi blockchain config
│   ├── context/               # React providers
│   └── package.json
├── contracts/                 # Foundry Smart Contracts
│   ├── src/
│   │   ├── TerritoryNFT.sol  # ERC-721 land ownership
│   │   ├── EnergyToken.sol   # ERC-20 game currency
│   │   ├── Building.sol      # Building management
│   │   ├── Battle.sol        # Combat system
│   │   └── Alliance.sol      # Guild system
│   ├── test/                 # Contract tests
│   ├── script/               # Deployment scripts
│   └── foundry.toml
├── docs/                      # Documentation
│   ├── ENERGY_CLASH_PLAN.md
│   ├── GRANT_APPLICATION.md
│   └── PROGRESS_SUMMARY.md
└── README.md                  # This file
```

---

## 🧪 Development

### Frontend Development

```bash
cd app

# Development server
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

### Smart Contract Development

```bash
cd contracts

# Compile contracts
forge build

# Run tests
forge test

# Run tests with coverage
forge coverage

# Deploy to testnet
forge script script/Deploy.s.sol \
  --rpc-url $X1_TESTNET_RPC \
  --broadcast \
  --verify

# Deploy to mainnet
forge script script/Deploy.s.sol \
  --rpc-url $X1_MAINNET_RPC \
  --broadcast \
  --verify
```

---

## 🔐 Security

### Audit Status

- ✅ **OpenZeppelin Libraries**: Battle-tested ERC standards
- ✅ **Access Control**: Ownable, Pausable patterns
- ✅ **Input Validation**: All user inputs validated
- ⏳ **Third-Party Audit**: Planned before mainnet
- ⏳ **Bug Bounty**: $10K program post-launch

### Security Features

- Pausable contracts for emergencies
- Rate limiting on critical functions
- Reentrancy guards where applicable
- Max supply caps on tokens
- Ownership verification on all actions

---

## 🌍 Roadmap

### Phase 1: Foundation ✅ (Complete)
- ✅ Smart contracts written and compiled
- ✅ 3D game interface built
- ✅ Wallet integration (RainbowKit)
- ✅ Core game mechanics implemented

### Phase 2: Testnet Launch 🚧 (In Progress)
- 🔄 Deploy contracts to X1 Testnet
- ⏳ Integration testing
- ⏳ 100 beta testers
- ⏳ Gameplay balancing

### Phase 3: Mainnet Launch ⏳ (Month 3)
- ⏳ Security audit completion
- ⏳ Deploy to X1 Mainnet
- ⏳ Public launch
- ⏳ Marketing campaign

### Phase 4: Advanced Features ⏳ (Month 4-6)
- ⏳ WebSocket real-time updates
- ⏳ Mobile app (iOS/Android)
- ⏳ Advanced tournaments
- ⏳ Cross-alliance wars

---

## 🤝 Contributing

We welcome contributions! VOLTA will be open-sourced after mainnet launch.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for smart contracts
- Update documentation for new features
- Follow existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **X1 EcoChain Team** - For the grant program and amazing blockchain
- **Alessandro Volta** - For inventing the battery and inspiring our name
- **Three.js Community** - For excellent 3D graphics
- **OpenZeppelin** - For secure smart contract libraries
- **React Three Fiber** - For making Three.js + React seamless


## 🌟 Star History

If you like VOLTA, give us a ⭐ on GitHub!

---

<div align="center">

**⚡ VOLTA - Build. Battle. Electrify. ⚡**

*The first blockchain strategy game where renewable energy dominates*

Built with 💚 for X1 EcoChain

[Play Now](#-quick-start) • [Documentation](#-documentation) • [GitHub](https://github.com/marvy247/volta)

</div>
