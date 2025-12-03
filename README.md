# 🎨 Creative Rights & Revenue Tracker V2.0

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.27-yellow?style=flat-square)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

> **A production-grade Web3 platform for transparent creative rights management, automated revenue distribution, and decentralized payment infrastructure.**

Built for filmmakers, musicians, designers, digital agencies, and NFT creators who need trustless, auditable revenue sharing with smart contract automation and fiat integration.

---

## 🌟 What Makes V2.0 Different

### Enterprise-Grade Blockchain Abstraction
**No more raw Web3 calls in your UI.** V2.0 implements a complete service-layer architecture that abstracts blockchain complexity:

```typescript
// ❌ Before (V1): Direct blockchain calls in components
const contract = new ethers.Contract(address, abi, signer);
await contract.distributeRevenue(projectId, { value: amount });

// ✅ After (V2): Clean business logic
const contractService = ContractService.getInstance();
await contractService.distributeRevenue(contractAddress, abi, projectId, amount);
```

### Hybrid Revenue Engine
**One interface, three modes:**
- 🔗 **On-Chain Mode**: Smart contract distribution (trustless, instant)
- 💵 **Fiat Mode**: Bank transfers via Stripe/Plaid (2-3 days)
- ⚡ **Hybrid Mode**: Crypto for some, fiat for others

### Role-Based Platform Split
**No more "one dashboard fits all":**
- **Admin Dashboard** → Platform oversight, all projects, user management, contract deployment
- **Creator Dashboard** → Personal earnings, project rights, withdrawal options
- **Middleware Protection** → Automatic role-based routing and access control

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐│
│  │ Admin Portal   │  │ Creator Portal │  │  Public Pages  ││
│  │ /admin/*       │  │ /creator/*     │  │  /login, etc.  ││
│  └────────────────┘  └────────────────┘  └────────────────┘│
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER (Singleton)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WalletService      │ Link accounts, network mgmt    │  │
│  │  PaymentService     │ Validation, gas estimation     │  │
│  │  ContractService    │ Smart contract interaction     │  │
│  │  TransactionService │ Tx tracking & monitoring       │  │
│  │  FiatService        │ On-ramp / Off-ramp            │  │
│  │  RevenueDistService │ Unified distribution engine    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 BLOCKCHAIN LAYER (Ethers.js v6)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ProjectRegistry.sol    │ Project & contributor mgmt │  │
│  │  RevenueDistributor.sol │ Automated payment splits   │  │
│  │  Polygon Mumbai Testnet │ Gas-efficient L2           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔥 Key Features

### 🔐 **Smart Contract Infrastructure**
- **ProjectRegistry**: On-chain project and contributor registry with ownership verification
- **RevenueDistributor**: Automated payment splitting with configurable shares (must sum to 100%)
- **OpenZeppelin Security**: ReentrancyGuard, Ownable, battle-tested patterns
- **Gas Optimization**: Batch operations, storage optimization, efficient loops
- **Event Emission**: Full transparency with indexed events for every action

### ⚡ **Service Layer Architecture**
- **Singleton Pattern**: Efficient resource management
- **Error Handling**: User-friendly error messages with retry detection
- **Transaction Tracking**: Real-time status updates with persistent history
- **Contract Caching**: Reduced initialization overhead
- **Type Safety**: Full TypeScript coverage with strict mode

### 💸 **Fiat Integration Layer**
- **On-Ramp**: Stripe, MoonPay, Transak → Convert fiat to crypto
- **Off-Ramp**: Plaid, Chimoney, Paystack → Convert crypto to bank deposits
- **Bank Linking**: Secure account verification and management
- **Transaction History**: Complete audit trail of all fiat conversions
- **Exchange Rate Estimates**: Real-time conversion calculations with fee transparency

### 🎯 **Role-Based Access Control**

The platform supports three distinct roles with separate dashboards and permissions:

#### **Admin Role** (`/admin/*`)
- **Access**: Platform-wide view of all data
- **Features**:
  - View ALL projects, creators, and contributors
  - Platform-wide revenue statistics
  - User management and role assignment
  - Smart contract deployment controls
  - Revenue distribution mode (Mock/Testnet/Production)
  - PaymentSplitter for batch distributions
- **Test Account**: `admin@risidio.com`

#### **Creator Role** (`/creator/*`)
- **Access**: Project owner view (only projects they created)
- **Features**:
  - View projects where `creatorId === user.id`
  - Manage contributors on their projects
  - Track revenue from their projects
  - Distribute payments to contributors
  - Fiat on-ramp (Top Up) and off-ramp (Withdraw)
  - Rights management for owned projects
- **Test Accounts**: 
  - `alex.rodriguez@email.com` (owns Neon Dreams project)
  - `sarah.kim@email.com` (owns Sustainable Brand project)

#### **Contributor Role** (`/contributor/*`)
- **Access**: Personal earnings view only
- **Features**:
  - View projects they contribute to
  - Track personal earnings and revenue share
  - View payout history
  - Manage wallet settings
  - NO access to project management or admin tools
- **Test Accounts**:
  - `maya.chen@email.com`
  - `david.park@email.com`

#### **Route Protection**
```
/admin/*       → Admin only
/creator/*     → Creator + Admin
/contributor/* → Contributor + Admin
/dashboard     → Redirects by role (no UI)
```

**Middleware**: Enforces role-based access with automatic redirects to `/unauthorized` for invalid access attempts.

### 📊 **Analytics & Reporting**
- **Revenue Trends**: Monthly charts with Chart.js/Recharts
- **Project Performance**: Real-time metrics and growth indicators
- **Contributor Leaderboards**: Top earners and active participants
- **CSV/PDF Export**: Generate reports for accounting and tax purposes

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.32 | React framework with App Router |
| React | 18.2.0 | UI library |
| TypeScript | 5.1.6 | Type safety |
| Tailwind CSS | 3.3.3 | Utility-first styling |
| Chart.js | 4.4.0 | Data visualization |
| Framer Motion | 10.16.4 | Animations |

### **Blockchain**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Ethers.js | 6.8.0 | Ethereum interaction |
| Hardhat | 2.27.1 | Development environment |
| Solidity | 0.8.20 | Smart contract language |
| OpenZeppelin | 5.4.0 | Security contracts |
| Polygon Mumbai | Testnet | Gas-efficient L2 |

### **Backend & APIs**
| Technology | Purpose |
|-----------|---------|
| Next.js API Routes | Server-side endpoints |
| Stripe API | On-ramp payment processing |
| Plaid API | Bank account verification |
| MoonPay API | Crypto on-ramp provider |

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
MetaMask browser extension
```

### 1️⃣ Clone & Install
```bash
git clone https://github.com/OmingoEmma/web3-distribution.git
cd web3-distribution
npm install
```

### 2️⃣ Environment Configuration
```bash
cp .env.local.example .env.local
```

**Required Environment Variables:**
```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Blockchain
NEXT_PUBLIC_REGISTRY_ADDRESS=0x1234...
NEXT_PUBLIC_DISTRIBUTOR_ADDRESS=0x5678...
NEXT_PUBLIC_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_CHAIN_ID=80001

# Fiat Integration
STRIPE_SECRET_KEY=sk_test_...
PLAID_CLIENT_ID=your_plaid_id
PLAID_SECRET=your_plaid_secret
MOONPAY_API_KEY=your_moonpay_key
```

### 3️⃣ Smart Contract Deployment
```bash
# Compile contracts
npm run compile

# Deploy to Mumbai testnet
npm run deploy:mumbai

# Verify on PolygonScan
npm run verify:mumbai
```

**Update deployed addresses in** `src/app/lib/contracts.ts`

### 4️⃣ Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5️⃣ Test with Demo Accounts

**Admin Dashboard** (`/admin/dashboard`):
```
Email: admin@risidio.com
Access: Full platform view, all projects, all users
```

**Creator Dashboard** (`/creator/dashboard`):
```
Email: alex.rodriguez@email.com
Access: Neon Dreams Music Video project only

Email: sarah.kim@email.com
Access: Sustainable Brand Identity project only
```

**Contributor Dashboard** (`/contributor/dashboard`):
```
Email: maya.chen@email.com
Access: Personal earnings from contributed projects

Email: david.park@email.com
Access: Personal earnings from contributed projects
```

**Note**: The `/dashboard` route automatically redirects to the appropriate dashboard based on user role.

### 6️⃣ Get Testnet Tokens
- Visit [Polygon Faucet](https://faucet.polygon.technology/)
- Connect wallet
- Request testnet MATIC

---

## 📁 Project Structure

```
web3-distribution/
├── contracts/                      # Solidity smart contracts
│   ├── ProjectRegistry.sol        # Project & contributor registry
│   ├── RevenueDistributor.sol     # Payment distribution logic
│   └── interfaces/                # Contract interfaces
│
├── src/app/
│   ├── admin/                     # Admin portal routes
│   │   ├── dashboard/            # Platform overview
│   │   ├── projects/             # All projects management
│   │   ├── contributors/         # User management
│   │   ├── rights/               # Rights oversight
│   │   └── revenue/              # Platform revenue
│   │
│   ├── creator/                   # Creator portal routes
│   │   ├── dashboard/            # Personal overview
│   │   ├── my-projects/          # Creator's projects
│   │   ├── my-rights/            # Creator's rights
│   │   ├── payouts/              # Withdrawal management
│   │   └── earnings-history/    # Revenue history
│   │
│   ├── api/                       # Next.js API routes
│   │   ├── payment/
│   │   │   ├── onramp/          # Fiat → Crypto
│   │   │   └── offramp/         # Crypto → Fiat
│   │   ├── projects/
│   │   ├── revenue/
│   │   └── users/
│   │
│   ├── lib/
│   │   ├── services/             # Service layer (core business logic)
│   │   │   ├── BaseService.ts
│   │   │   ├── WalletService.ts
│   │   │   ├── PaymentService.ts
│   │   │   ├── ContractService.ts
│   │   │   ├── TransactionService.ts
│   │   │   ├── FiatService.ts
│   │   │   └── ErrorHandler.ts
│   │   │
│   │   ├── auth.tsx              # Authentication context
│   │   ├── wallet.tsx            # Wallet connection context
│   │   ├── contracts.ts          # Contract addresses & ABIs
│   │   └── utils.ts              # Helper functions
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   └── layouts/              # Layout components
│   │
│   └── data/
│       └── mockData.ts           # Development mock data
│
├── test/                          # Smart contract tests
│   ├── PaymentService.test.ts
│   └── ContractService.test.ts
│
├── scripts/                       # Deployment & utility scripts
│   ├── deploy.js
│   └── verify.js
│
├── hardhat.config.ts             # Hardhat configuration
├── middleware.ts                 # Route protection middleware
└── tsconfig.json                 # TypeScript configuration
```

---

## 🔧 Smart Contract Architecture

### **ProjectRegistry.sol**
Manages project metadata and contributor ownership structure.

**Key Functions:**
```solidity
function registerProject(
    string calldata projectId,
    string calldata name,
    address[] calldata contributors,
    uint256[] calldata shares  // Must sum to 100
) external onlyOwner;

function getProject(string calldata projectId) 
    external view returns (Project memory);

function isProjectActive(string calldata projectId) 
    external view returns (bool);
```

**Events:**
```solidity
event ProjectRegistered(
    string indexed projectId,
    string name,
    address[] contributors,
    uint256[] shares,
    uint256 timestamp
);
```

### **RevenueDistributor.sol**
Handles automated payment distribution based on registered shares.

**Key Functions:**
```solidity
function distributeRevenue(string calldata projectId) 
    external payable nonReentrant;

function withdrawContributorBalance() 
    external nonReentrant;

function getContributorBalance(address contributor) 
    external view returns (uint256);
```

**Security Features:**
- ✅ ReentrancyGuard on all payable functions
- ✅ Pull payment pattern (contributors withdraw)
- ✅ Ownership verification
- ✅ Safe math operations (Solidity 0.8+)

---

## 💼 Service Layer Deep Dive

### **WalletService**
Handles wallet connection and network management.

```typescript
const walletService = WalletService.getInstance();

// Link account (user-friendly terminology)
const walletInfo = await walletService.linkAccount();

// Switch to required network
await walletService.ensureNetwork(80001); // Polygon Mumbai

// Get wallet information
const info = await walletService.getWalletInfo();
```

### **PaymentService**
Manages payment validation and gas estimation.

```typescript
const paymentService = PaymentService.getInstance();

// Validate before sending
const validation = await paymentService.validatePayment({
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  amount: '0.1',
});

// Estimate gas costs
const estimate = await paymentService.estimateGas(paymentRequest);

// Send payment
const receipt = await paymentService.sendPayment(paymentRequest);
```

### **ContractService**
Abstracts smart contract interactions.

```typescript
const contractService = ContractService.getInstance();

// Load contract
const contract = await contractService.loadContract(
  contractAddress,
  REVENUE_DISTRIBUTOR_ABI
);

// Distribute revenue
const receipt = await contractService.distributeRevenue(
  contractAddress,
  abi,
  'project-001',
  '1.0' // 1 ETH
);

// Read project details
const project = await contractService.getProjectDetails(
  contractAddress,
  abi,
  'project-001'
);
```

### **FiatService**
Bridges crypto and traditional banking.

```typescript
const fiatService = FiatService.getInstance();

// On-ramp: Fiat → Crypto
const onRampTx = await fiatService.onRamp({
  amount: '100',
  currency: 'USD',
  paymentMethod: 'card',
  destinationAddress: walletAddress,
});

// Off-ramp: Crypto → Bank
const offRampTx = await fiatService.offRamp({
  amount: '0.5',
  currency: 'USD',
  sourceAddress: walletAddress,
  bankAccountId: 'bank_123',
});

// Add bank account
const bankAccount = await fiatService.addBankAccount({
  accountHolderName: 'John Doe',
  bankName: 'Bank of America',
  accountNumber: '123456789',
  routingNumber: '021000021',
  accountType: 'checking',
});
```

---

## 🧪 Testing

### **Run Smart Contract Tests**
```bash
npm test
```

### **Test with Gas Reporting**
```bash
npm run test:gas
```

### **Test Coverage**
```bash
npx hardhat coverage
```

**Current Coverage:**
- ✅ Payment validation
- ✅ Gas estimation
- ✅ Contract deployment
- ✅ Revenue distribution
- ✅ Contributor withdrawals
- ✅ Project management

---

## 🚢 Deployment

### **Deploy to Polygon Mumbai Testnet**
```bash
npm run deploy:mumbai
```

**Output:**
```
Deploying contracts to Mumbai testnet...
ProjectRegistry deployed to: 0x1234...
RevenueDistributor deployed to: 0x5678...
✅ Deployment successful!
```

### **Verify Contracts on PolygonScan**
```bash
npm run verify:mumbai
```

### **Update Configuration**
After deployment, update `src/app/lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  mumbai: {
    ProjectRegistry: '0x1234...', // Your deployed address
    RevenueDistributor: '0x5678...', // Your deployed address
  },
};
```

---

## 🔐 Security Features

### **Smart Contract Security**
- ✅ OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard on all payable functions
- ✅ Ownable for access control
- ✅ Input validation and bounds checking
- ✅ Safe math operations (no overflow/underflow)
- ✅ Pull payment pattern (prevents reentrancy)

### **Application Security**
- ✅ Middleware-based route protection
- ✅ Role-based access control
- ✅ Encrypted bank account storage
- ✅ CSRF protection on API routes
- ✅ Rate limiting on payment endpoints
- ✅ Transaction signature verification

### **Best Practices**
- Never expose private keys
- Use environment variables for secrets
- Implement 2FA for withdrawals
- Set withdrawal limits
- Log all financial transactions
- Regular security audits

---

## 📊 Performance Optimizations

### **Blockchain Layer**
- ✅ Contract instance caching
- ✅ Batch payment support
- ✅ Gas optimization techniques
- ✅ Event-driven updates (no polling)

### **Service Layer**
- ✅ Singleton pattern for services
- ✅ Transaction pooling
- ✅ Lazy initialization
- ✅ Memoized computations

### **Frontend**
- ✅ Server-side rendering (Next.js 14)
- ✅ Image optimization
- ✅ Code splitting
- ✅ React.memo for expensive components

---

## 🌐 Supported Networks

| Network | Chain ID | Purpose | Gas Token |
|---------|----------|---------|-----------|
| Ethereum Mainnet | 1 | Production | ETH |
| Polygon Mainnet | 137 | Production (L2) | MATIC |
| **Polygon Mumbai** | **80001** | **Testnet** | **MATIC** |
| BSC Mainnet | 56 | Production | BNB |
| BSC Testnet | 97 | Testnet | BNB |
| Hardhat Local | 31337 | Development | ETH |

---

## 📖 API Documentation

### **Authentication**
All API routes use role-based authentication via middleware.

### **Revenue Distribution**
```http
POST /api/payment/distribute
Content-Type: application/json

{
  "projectId": "project-001",
  "amount": "1.0",
  "mode": "onchain" // or "fiat" or "hybrid"
}
```

### **On-Ramp Estimate**
```http
GET /api/payment/onramp?amount=100&currency=USD

Response:
{
  "fiatAmount": "100",
  "cryptoAmount": "0.043",
  "fees": "2.50",
  "exchangeRate": "0.00043"
}
```

### **Off-Ramp Initiate**
```http
POST /api/payment/offramp
Content-Type: application/json

{
  "amount": "0.5",
  "currency": "USD",
  "sourceAddress": "0x123...",
  "bankAccountId": "bank_abc123"
}
```

---

## 🎯 Use Cases

### **Film Production**
- Register film projects with cast/crew shares
- Automatically split box office revenue
- Track royalties from streaming platforms
- Manage distribution rights and licensing

### **Music Industry**
- Split streaming royalties among collaborators
- Track sync licensing payments
- Manage performance rights
- Handle sample clearances and splits

### **Digital Agencies**
- Split client payments among team members
- Track project profitability
- Manage contractor payments
- Handle milestone-based distributions

### **NFT Collections**
- Configure royalty splits for collaborators
- Automate secondary sale distributions
- Track collection performance
- Manage community treasury

---

## 🗺️ Roadmap

### **Q1 2025** ✅ Completed
- [x] Role-based platform split
- [x] Smart contract deployment
- [x] Fiat on-ramp/off-ramp
- [x] Service layer architecture
- [x] Transaction monitoring

### **Q2 2025** 🔄 In Progress
- [ ] Multi-signature wallet support
- [ ] Layer 2 integrations (Optimism, Arbitrum)
- [ ] ERC-20 token support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### **Q3 2025** 📋 Planned
- [ ] Gasless transactions (meta-transactions)
- [ ] DAO governance integration
- [ ] Cross-chain bridges
- [ ] AI-powered fraud detection
- [ ] Tax reporting automation

### **Q4 2025** 🔮 Future
- [ ] Decentralized identity (DID)
- [ ] IPFS integration for contracts
- [ ] Multi-chain support expansion
- [ ] White-label platform offering

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Reporting Bugs**
1. Check existing issues
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### **Proposing Features**
1. Open a discussion issue
2. Describe the feature and use case
3. Wait for maintainer feedback
4. Submit a PR if approved

### **Development Workflow**
```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# 4. Add tests
npm test

# 5. Commit with conventional commits
git commit -m "feat: add new feature"

# 6. Push and create PR
git push origin feature/your-feature-name
```

### **Code Standards**
- TypeScript strict mode
- ESLint rules compliance
- Prettier formatting
- Test coverage > 80%
- Documentation for public APIs

---

## 👥 Team


#### **Jeevesh Singale** - Original Creator (V1.0)
*Founding Developer*

📧 Email: jeevesh2515@gmail.com  
🔗 GitHub: [@jeevesh2515](https://github.com/jeevesh2515)  
🏢 Organization: Lunim Corporate & RISIDIO Group



#### **Emma Mary A. Omingo** - V2.0 Solidity Lead Developer
*Smart Contract & Blockchain Lead Developer*

🔗 GitHub: [@OmingoEmma](https://github.com/OmingoEmma)  
📧 Email: emmaomingo@gmail.com  
🏢 Organization: RISIDIO Group (2025 Internship)

**Contributions:**
- 🏗️ Smart contract architecture (ProjectRegistry, RevenueDistributor)
- ⚡ Service layer design and implementation
- 💸 Fiat on-ramp/off-ramp integration
- 🎨 Role-based dashboard system
- 📊 Revenue distribution engine
- 🔐 Security hardening and gas optimization

**Contributions:**
- 🚀 Initial platform concept and architecture
- 🎨 Original UI/UX design
- 📦 Project structure and setup
- 📝 Core documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Emma Mary A. Omingo & Jeevesh Singale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Security-focused smart contract libraries
- **Hardhat** - Ethereum development environment
- **Next.js Team** - Modern React framework
- **Ethers.js** - Clean Ethereum library
- **RISIDIO Group** - Internship opportunity and support
- **Polygon** - Gas-efficient L2 infrastructure

---



---

## 📞 Support

### **Technical Issues**
- 📧 Email: emmaomingo@gmail.com
- 🐛 GitHub Issues: [Create an issue](https://github.com/OmingoEmma/web3-distribution/issues)

### **Business Inquiries**
- 📧 RISIDIO Group: contact@risidio.com
- 🌐 Website: [www.risidio.com](https://www.risidio.com)

---

<div align="center">

**Built with ❤️ by the RISIDIO Team**

⭐ **Star this repo if you find it useful!** ⭐

[Report Bug](https://github.com/OmingoEmma/web3-distribution/issues) · [Request Feature](https://github.com/OmingoEmma/web3-distribution/issues) · [Documentation](./docs/)

</div>
