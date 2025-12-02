import { ethers } from 'ethers';
import { ErrorHandler } from './ErrorHandler';
import { ServiceError } from './types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export abstract class BaseService {
  protected provider: ethers.BrowserProvider | null = null;
  protected signer: ethers.Signer | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeProvider();
    }
  }

  protected initializeProvider(): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  protected async getSigner(): Promise<ethers.Signer> {
    if (!this.provider) {
      ErrorHandler.throwError(new Error('Provider not initialized'), 'getSigner');
    }
    
    try {
      this.signer = await this.provider!.getSigner();
      return this.signer;
    } catch (error) {
      ErrorHandler.throwError(error, 'Failed to get signer');
    }
  }

  protected async ensureConnection(): Promise<void> {
    if (!this.provider) {
      this.initializeProvider();
    }
    
    if (!this.provider) {
      ErrorHandler.throwError(
        new Error('WALLET_NOT_FOUND'),
        'Wallet connection required'
      );
    }

    if (!this.signer) {
      await this.getSigner();
    }
  }

  protected handleError(error: any, context: string): ServiceError {
    return ErrorHandler.handle(error, context);
  }

  protected async getNetwork(): Promise<ethers.Network> {
    await this.ensureConnection();
    return await this.provider!.getNetwork();
  }

  protected async getBlockNumber(): Promise<number> {
    await this.ensureConnection();
    return await this.provider!.getBlockNumber();
  }
}
