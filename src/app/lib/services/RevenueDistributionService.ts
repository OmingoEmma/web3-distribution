import { BaseService } from './BaseService';
import { ContractService } from './ContractService';
import { PaymentService } from './PaymentService';
import { TransactionService } from './TransactionService';
import { TransactionReceipt } from './types';

export type DistributionMode = 'mock' | 'testnet' | 'production';

export interface RevenueShare {
  contributorId: string;
  contributorName: string;
  walletAddress: string;
  percentage: number;
  amount: number;
}

export interface DistributionRequest {
  projectId: string;
  projectName: string;
  totalAmount: number;
  shares: RevenueShare[];
  mode: DistributionMode;
  contractAddress?: string;
  useSmartContract: boolean;
}

export interface DistributionResult {
  success: boolean;
  mode: DistributionMode;
  totalAmount: number;
  distributedAmount: number;
  transactions: TransactionReceipt[];
  errors: string[];
  timestamp: number;
}

export class RevenueDistributionService extends BaseService {
  private static instance: RevenueDistributionService;
  private contractService: ContractService;
  private paymentService: PaymentService;
  private transactionService: TransactionService;
  private currentMode: DistributionMode = 'mock';

  private constructor() {
    super();
    this.contractService = ContractService.getInstance();
    this.paymentService = PaymentService.getInstance();
    this.transactionService = TransactionService.getInstance();
    
    // Load saved mode from localStorage
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('distribution_mode');
      if (savedMode) {
        this.currentMode = savedMode as DistributionMode;
      }
    }
  }

  static getInstance(): RevenueDistributionService {
    if (!RevenueDistributionService.instance) {
      RevenueDistributionService.instance = new RevenueDistributionService();
    }
    return RevenueDistributionService.instance;
  }

  setMode(mode: DistributionMode): void {
    this.currentMode = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('distribution_mode', mode);
    }
  }

  getMode(): DistributionMode {
    return this.currentMode;
  }

  async distributeRevenue(request: DistributionRequest): Promise<DistributionResult> {
    const mode = request.mode || this.currentMode;

    try {
      switch (mode) {
        case 'mock':
          return await this.distributeMock(request);
        case 'testnet':
          return await this.distributeTestnet(request);
        case 'production':
          return await this.distributeProduction(request);
        default:
          throw new Error(`Unknown distribution mode: ${mode}`);
      }
    } catch (error) {
      throw this.handleError(error, 'Failed to distribute revenue');
    }
  }

  private async distributeMock(request: DistributionRequest): Promise<DistributionResult> {
    console.log('Mock distribution:', request);

    // Simulate distribution
    const transactions: TransactionReceipt[] = [];
    const errors: string[] = [];

    for (const share of request.shares) {
      const mockTx: TransactionReceipt = {
        hash: `0x${Math.random().toString(16).slice(2, 66)}`,
        from: '0x0000000000000000000000000000000000000000',
        to: share.walletAddress,
        value: share.amount.toString(),
        blockNumber: Math.floor(Math.random() * 1000000),
        status: 'confirmed' as any,
        timestamp: Date.now(),
        gasUsed: '21000',
        effectiveGasPrice: '20000000000',
      };
      transactions.push(mockTx);
    }

    const result: DistributionResult = {
      success: true,
      mode: 'mock',
      totalAmount: request.totalAmount,
      distributedAmount: request.shares.reduce((sum, s) => sum + s.amount, 0),
      transactions,
      errors,
      timestamp: Date.now(),
    };

    this.saveDistributionHistory(request, result);
    return result;
  }

  private async distributeTestnet(request: DistributionRequest): Promise<DistributionResult> {
    console.log('Testnet distribution:', request);

    const transactions: TransactionReceipt[] = [];
    const errors: string[] = [];

    if (request.useSmartContract && request.contractAddress) {
      // Use smart contract for distribution
      try {
        const receipt = await this.distributeViaContract(request);
        transactions.push(receipt);
      } catch (error: any) {
        errors.push(`Contract distribution failed: ${error.message}`);
      }
    } else {
      // Direct wallet-to-wallet transfers
      for (const share of request.shares) {
        try {
          const receipt = await this.paymentService.sendPayment({
            to: share.walletAddress,
            amount: share.amount.toString(),
            memo: `Revenue share for ${request.projectName}`,
          });
          transactions.push(receipt);
        } catch (error: any) {
          errors.push(`Payment to ${share.contributorName} failed: ${error.message}`);
        }
      }
    }

    const distributedAmount = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0);

    const result: DistributionResult = {
      success: errors.length === 0,
      mode: 'testnet',
      totalAmount: request.totalAmount,
      distributedAmount,
      transactions,
      errors,
      timestamp: Date.now(),
    };

    this.saveDistributionHistory(request, result);
    return result;
  }

  private async distributeProduction(request: DistributionRequest): Promise<DistributionResult> {
    console.log('Production distribution:', request);

    const transactions: TransactionReceipt[] = [];
    const errors: string[] = [];

    if (request.useSmartContract && request.contractAddress) {
      // Use smart contract for distribution
      try {
        const receipt = await this.distributeViaContract(request);
        transactions.push(receipt);
      } catch (error: any) {
        errors.push(`Contract distribution failed: ${error.message}`);
      }
    } else {
      // Direct wallet-to-wallet transfers
      for (const share of request.shares) {
        try {
          const receipt = await this.paymentService.sendPayment({
            to: share.walletAddress,
            amount: share.amount.toString(),
            memo: `Revenue share for ${request.projectName}`,
          });
          transactions.push(receipt);
        } catch (error: any) {
          errors.push(`Payment to ${share.contributorName} failed: ${error.message}`);
        }
      }
    }

    const distributedAmount = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0);

    const result: DistributionResult = {
      success: errors.length === 0,
      mode: 'production',
      totalAmount: request.totalAmount,
      distributedAmount,
      transactions,
      errors,
      timestamp: Date.now(),
    };

    this.saveDistributionHistory(request, result);
    return result;
  }

  private async distributeViaContract(request: DistributionRequest): Promise<TransactionReceipt> {
    if (!request.contractAddress) {
      throw new Error('Contract address is required for smart contract distribution');
    }

    // This would use the actual RevenueDistributor.sol contract
    // For now, we simulate the contract call
    const addresses = request.shares.map(s => s.walletAddress);
    const amounts = request.shares.map(s => s.amount);

    // Simulate contract interaction
    const mockReceipt: TransactionReceipt = {
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      from: '0x0000000000000000000000000000000000000000',
      to: request.contractAddress,
      value: request.totalAmount.toString(),
      blockNumber: Math.floor(Math.random() * 1000000),
      status: 'confirmed' as any,
      timestamp: Date.now(),
      gasUsed: '150000',
      effectiveGasPrice: '20000000000',
    };

    return mockReceipt;
  }

  async distributeFiatRevenue(request: DistributionRequest): Promise<DistributionResult> {
    console.log('Fiat distribution:', request);

    // For fiat-only creators, we simulate off-chain distribution
    const transactions: TransactionReceipt[] = [];
    const errors: string[] = [];

    for (const share of request.shares) {
      const mockTx: TransactionReceipt = {
        hash: `fiat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        from: 'platform_treasury',
        to: share.contributorId,
        value: share.amount.toString(),
        blockNumber: 0,
        status: 'confirmed' as any,
        timestamp: Date.now(),
        gasUsed: '0',
        effectiveGasPrice: '0',
      };
      transactions.push(mockTx);
    }

    const result: DistributionResult = {
      success: true,
      mode: this.currentMode,
      totalAmount: request.totalAmount,
      distributedAmount: request.shares.reduce((sum, s) => sum + s.amount, 0),
      transactions,
      errors,
      timestamp: Date.now(),
    };

    this.saveDistributionHistory(request, result);
    return result;
  }

  getDistributionHistory(limit: number = 20): DistributionResult[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem('distribution_history');
      const history: DistributionResult[] = stored ? JSON.parse(stored) : [];
      return history.slice(0, limit);
    } catch (error) {
      console.error('Failed to get distribution history:', error);
      return [];
    }
  }

  private saveDistributionHistory(request: DistributionRequest, result: DistributionResult): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('distribution_history');
      const history: DistributionResult[] = stored ? JSON.parse(stored) : [];
      history.unshift(result);
      localStorage.setItem('distribution_history', JSON.stringify(history.slice(0, 100)));
    } catch (error) {
      console.error('Failed to save distribution history:', error);
    }
  }

  calculateShares(totalAmount: number, contributors: Array<{ id: string; name: string; walletAddress: string; percentage: number }>): RevenueShare[] {
    return contributors.map(contributor => ({
      contributorId: contributor.id,
      contributorName: contributor.name,
      walletAddress: contributor.walletAddress,
      percentage: contributor.percentage,
      amount: (totalAmount * contributor.percentage) / 100,
    }));
  }
}
