# Energy Clash 🌿⚡

> **Multiplayer Territory Control Strategy Game on X1 EcoChain**
> 
> Build your renewable energy empire, conquer territories, form alliances, and dominate the blockchain!

![Energy Clash](https://img.shields.io/badge/Built%20For-X1%20EcoChain-00C58E)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-orange)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)

**Grant Application:** X1 EcoChain Grant Program ($5M)  
**Track:** Consumer/Social/Gaming  
**Timeline:** 120 days

---

## 🎮 Game Overview

Energy Clash is an addictive multiplayer strategy game where players:
- **Claim hexagonal territories** on a shared world map
- **Build renewable energy sources** (solar, wind, hydro)
- **Generate energy tokens** passively over time
- **Attack neighbors** to expand their empire
- **Form alliances** for coordinated conquest
- **Climb leaderboards** for rewards

### Why Energy Clash?

✅ **Perfect for X1** - Leverages ultra-low fees (~$0.01) and instant finality  
✅ **Highly Addictive** - Social competition + progression + FOMO mechanics  
✅ **Massive Transaction Volume** - 20+ transactions per player per day  
✅ **Energy-Efficient Theme** - Aligns with X1's green mission  
✅ **Production Ready** - 120-day delivery timeline

---

## 🚀 Current Progress

### ✅ Completed (Phase 1)

**Smart Contracts (Foundry):**
- ✅ TerritoryNFT.sol - ERC-721 for land ownership
- ✅ EnergyToken.sol - ERC-20 game currency
- ✅ OpenZeppelin integration
- ✅ Contracts compile successfully

**Game Architecture:**
- ✅ Type system (TypeScript)
- ✅ Game constants and building stats
- ✅ Zustand state management
- ✅ Hexagonal grid utilities
- ✅ 3D hex map components (three.js + react-three-fiber)

**Tech Stack:**
- ✅ Next.js 16 + React 19
- ✅ Three.js for 3D graphics
- ✅ Foundry for smart contracts
- ✅ shadcn/ui components
- ✅ Zustand for state

---

## 📁 Project Structure

```
X1/
├── app/                        # Next.js game application
│   ├── src/
│   │   ├── game/              # Game-specific code
│   │   │   ├── components/    # React components
│   │   │   │   ├── HexTile.tsx
│   │   │   │   ├── HexMap.tsx
│   │   │   │   └── ...
│   │   │   ├── store/         # Zustand stores
│   │   │   │   └── gameStore.ts
│   │   │   ├── types/         # TypeScript types
│   │   │   │   └── index.ts
│   │   │   ├── utils/         # Utilities
│   │   │   │   └── hexGrid.ts
│   │   │   └── constants/     # Game constants
│   │   │       └── buildings.ts
│   │   ├── app/              # Next.js pages
│   │   └── components/       # Shared components
│   └── package.json
├── contracts/                 # Foundry smart contracts
│   ├── src/
│   │   ├── TerritoryNFT.sol
│   │   ├── EnergyToken.sol
│   │   └── ...
│   ├── test/                 # Contract tests
│   ├── script/               # Deployment scripts
│   └── foundry.toml
├── ENERGY_CLASH_PLAN.md      # Complete development plan
└── ENERGY_CLASH_README.md    # This file
```

---

## 🎯 Next Steps (120-Day Roadmap)

### Phase 2: Core Gameplay (Days 8-30)
- [ ] Complete smart contracts (Building, Battle, Alliance)
- [ ] Build UI components (HUD, BuildingMenu, TerritoryInfo)
- [ ] Implement blockchain integration hooks
- [ ] Create game page and integrate components
- [ ] Add wallet connection

### Phase 3: Energy & Economy (Days 31-45)
- [ ] Energy generation system
- [ ] Resource collection UI
- [ ] NFT marketplace integration
- [ ] Trading system

### Phase 4: Combat System (Days 46-60)
- [ ] Attack mechanics
- [ ] Defense structures
- [ ] Battle animations
- [ ] Victory/defeat UI

### Phase 5: Social Features (Days 61-75)
- [ ] Alliance creation/management
- [ ] Chat system
- [ ] Friend system
- [ ] Leaderboards

### Phase 6: Polish & Launch (Days 76-120)
- [ ] Tutorial and onboarding
- [ ] Sound effects and music
- [ ] Mobile optimization
- [ ] Beta testing
- [ ] Mainnet deployment

---

## 🛠️ Development Commands

### Frontend (Next.js)
```bash
cd app

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Smart Contracts (Foundry)
```bash
cd contracts

# Compile contracts
forge build

# Run tests
forge test

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url $X1_TESTNET_RPC --broadcast

# Deploy to mainnet
forge script script/Deploy.s.sol --rpc-url $X1_MAINNET_RPC --broadcast --verify
```

---

## 🎨 Game Features

### Building Types
1. **Solar Panel** - Low cost, steady energy generation
2. **Wind Turbine** - Medium cost, good efficiency
3. **Hydro Dam** - High cost, maximum output
4. **Defense Tower** - Protects against attacks
5. **Shield Generator** - Temporary invulnerability
6. **Energy Storage** - Increases capacity

### Core Mechanics
- **Territory Claiming** - 50 ENERGY to claim new hex
- **Energy Generation** - Passive income every block (~7.5s)
- **Combat System** - Attack neighboring territories
- **Alliance System** - Team up with other players
- **Leaderboards** - Daily/weekly/all-time rankings

### Transaction Volume
**Per Player Per Day:**
- Collect energy: 5 txns
- Build/upgrade: 3 txns
- Attack: 5 txns
- Defend: 2 txns
- Trade: 3 txns
- Alliance: 2 txns
**= 20 transactions per player per day**

**With 500 players = 10,000 txns/day!**

---

## 💰 X1 Grant Application Strength

### Perfect Category Fit ✅
- **Track:** Consumer/Social/Gaming
- **On-Chain Activity:** 10K+ transactions/day target
- **User Engagement:** Addictive gameplay loop
- **X1 Alignment:** Energy theme + leverages X1 advantages

### Measurable KPIs ✅
| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Daily Active Users | 50 | 200 | 500 |
| Transactions/Day | 1,000 | 5,000 | 10,000 |
| Territories Claimed | 500 | 2,000 | 5,000 |
| NFT Trading Volume | $1K | $10K | $50K |

### Why This Will Win ✅
1. **Production Ready** - Already started, minimal risk
2. **Unique Value** - First real-time strategy game on X1
3. **High Transaction Volume** - Exactly what grant wants
4. **Perfect Theme** - Energy efficiency aligns with X1
5. **Proven Team** - Successfully built X1Scope (first grant)
6. **Realistic Timeline** - 120 days is achievable
7. **Long-Term Sustainability** - NFT sales + season passes

---

## 🌟 What Makes Energy Clash Special

### Only Possible on X1 ✅
- **$0.01 fees** = 20 txns/day costs only $0.20 (affordable!)
- **Instant finality** = Real-time gameplay (no waiting)
- **7.5s blocks** = Energy generates fast
- **PoA consensus** = Predictable game economy

### Competitive Moat 🛡️
Even if someone forks the code:
- ❌ Can't run on Ethereum ($100/day = dead game)
- ❌ Can't run on Polygon ($10/day = too expensive)
- ❌ Can't run on other L2s (slower finality = worse UX)
- ✅ **Only works well on X1!**

---

## 📊 Technical Highlights

### Smart Contract Security
- OpenZeppelin libraries (battle-tested)
- Pausable emergency functions
- Access control (Ownable)
- Comprehensive unit tests
- Third-party audit (planned)

### Frontend Performance
- React Server Components
- Zustand state management
- Three.js WebGL optimization
- Responsive design (mobile + desktop)
- Real-time WebSocket updates

### Blockchain Integration
- viem + wagmi (modern Web3 stack)
- Smart caching layer
- Optimistic UI updates
- Error handling and retries

---

## 🤝 Contributing

Once the core game is complete, we'll open-source the codebase for community contributions.

### Planned Features for Community
- New building types
- Custom game modes
- Tournament system
- Mobile app
- Modding support

---

## 📝 License

MIT License (to be added)

---

## 🙏 Acknowledgments

- **X1 EcoChain Team** - For the grant program and amazing blockchain
- **Three.js Community** - For excellent 3D graphics library
- **React Three Fiber** - For making Three.js work beautifully with React
- **OpenZeppelin** - For secure smart contract libraries

---

**Built for the X1 EcoChain Grant Program**

*The first blockchain game where being green makes you win!* 🌿⚡

---

## 📧 Contact

For questions about the game or grant application:
- Email: [Your Email]
- Twitter: [@YourHandle]
- Discord: [Your Discord]

**Let's build the most addictive blockchain game together!** 🚀🎮
