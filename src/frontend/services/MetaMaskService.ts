declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}

class MetaMaskService {
  async isMetaMaskInstalled(): Promise<boolean> {
    const isInstalled = typeof window.ethereum !== 'undefined';
    return isInstalled;
  }

  async getEthereumAddress(): Promise<string> {
    console.log('Getting Ethereum address...');
    if (!(await this.isMetaMaskInstalled())) {
      alert('MetaMask is not installed.');
      throw new Error('MetaMask is not installed');
    }

    let accounts = await window.ethereum!.request({ method: 'eth_accounts' });

    if (accounts.length === 0) {
      accounts = await window.ethereum!.request({ method: 'eth_requestAccounts' });
    }

    if (accounts.length === 0) {
      alert('Metamask is locked.');
      throw new Error('Metamask is locked.');
    }

    console.log('Ethereum address:', accounts[0]);
    return accounts[0];
  }

  async signMessage(message: string): Promise<string> {
    console.log('Signing message...');
    if (!(await this.isMetaMaskInstalled())) {
      alert('MetaMask is not installed.');
      throw new Error('MetaMask is not installed');
    }

    const ethereumAddress = await this.getEthereumAddress();
    const signature = await window.ethereum!.request({
      method: 'personal_sign',
      params: [message, ethereumAddress],
    });
    return signature;
  }
}

export default new MetaMaskService();