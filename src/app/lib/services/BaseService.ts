import { ethers } from 'ethers';

class ErrorHandler {
  handle(error: any, context?: string): Error {
    const message = context
      ? `${context}: ${error?.message ?? String(error)}`
      : (error?.message ?? String(error));
    return new Error(message);
  }
}

export abstract class BaseService {
  protected provider: ethers.BrowserProvider | null = null;
  protected signer: ethers.Signer | null = null;
  protected errorHandler: ErrorHandler;

  constructor() {
    this.errorHandler = new ErrorHandler();
    this.initializeProvider();
  }

  protected async initializeProvider(): Promise<void> {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  protected async getSigner(): Promise<ethers.Signer> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    if (!this.signer) {
      this.signer = await this.provider.getSigner();
    }
    return this.signer;
  }

  protected async ensureConnection(): Promise<void> {
    if (!this.provider) {
      await this.initializeProvider();
    }
    if (!this.signer) {
      await this.getSigner();
    }
  }

  protected handleError(error: any, context: string): never {
    throw this.errorHandler.handle(error, context);
  }
}
