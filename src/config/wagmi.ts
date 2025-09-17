import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { liskSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DeChat dApp',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [liskSepolia],
  ssr: false,
});