import { ethers } from 'ethers';
import { BaseService } from './BaseService';
import { WalletInfo, NetworkConfig } from './types';
import { ErrorHandler } from './ErrorHandler';

export class WalletService extends BaseService {
  private static instance: WalletService;

  private constructor() {
    super();
  }

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async linkAccount(): Promise<WalletInfo> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window is not defined. This function must be called in a browser environment.');
      }

      if (!window.ethereum) {
        throw new Error('MetaMask or Web3 wallet not detected. Please install MetaMask to continue.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }).catch((err: any) => {
        if (err.code === 4001) {
          throw new Error('User rejected the connection request.');
        }
        throw err;
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet and try again.');
      }

      return await this.getWalletInfo();
    } catch (error: any) {
      console.error('[WalletService] linkAccount error:', error);
      throw this.handleError(error, error.message || 'Failed to link account');
    }
  }

  async getWalletInfo(): Promise<WalletInfo> {
    try {
      await this.ensureConnection();

      const signer = await this.getSigner();
      const address = await signer.getAddress();
      const balance = await this.provider!.getBalance(address);
      const network = await this.provider!.getNetwork();

      return {
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        networkName: this.getNetworkName(Number(network.chainId)),
        isConnected: true,
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to get wallet info');
    }
  }

  async ensureNetwork(requiredChainId: number): Promise<void> {
    try {
      const network = await this.getNetwork();
      const currentChainId = Number(network.chainId);

      if (currentChainId !== requiredChainId) {
        await this.switchNetwork(requiredChainId);
      }
    } catch (error) {
      throw this.handleError(error, 'Failed to ensure network');
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Wallet not available');
      }

      const hexChainId = `0x${chainId.toString(16)}`;
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      }).catch(async (error: any) => {
        // Network not added to wallet
        if (error.code === 4902) {
          const networkConfig = this.getNetworkConfig(chainId);
          if (networkConfig) {
            await this.addNetwork(networkConfig);
            // Try switching again after adding
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: hexChainId }],
            });
          } else {
            throw new Error(`Network ${chainId} is not supported`);
          }
        } else if (error.code === 4001) {
          throw new Error('User rejected network switch request');
        } else {
          throw error;
        }
      });
    } catch (error: any) {
      console.error('[WalletService] switchNetwork error:', error);
      throw this.handleError(error, error.message || 'Failed to switch network');
    }
  }

  async addNetwork(config: NetworkConfig): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [config],
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to add network');
    }
  }

  getNetworkName(chainId: number): string {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
      43114: 'Avalanche C-Chain',
      43113: 'Avalanche Fuji',
    };

    return networks[chainId] || `Unknown Network (${chainId})`;
  }

  getNetworkConfig(chainId: number): NetworkConfig | null {
    const configs: Record<number, NetworkConfig> = {
      1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io/'],
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/'],
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      },
      80001: {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai',
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      },
      56: {
        chainId: '0x38',
        chainName: 'BSC Mainnet',
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      },
      97: {
        chainId: '0x61',
        chainName: 'BSC Testnet',
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      },
    };

    return configs[chainId] || null;
  }

  async isWalletInstalled(): Promise<boolean> {
    return typeof window !== 'undefined' && !!window.ethereum;
  }

  async getAccounts(): Promise<string[]> {
    try {
      if (!window.ethereum) {
        return [];
      }

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      return accounts || [];
    } catch (error) {
      console.error('Failed to get accounts:', error);
      return [];
    }
  }
}
