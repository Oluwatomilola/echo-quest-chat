import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Shield, Users, Zap } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Landing = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Decentralized Chat',
      description: 'Chat with anyone using their wallet address or custom ENS name'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your messages are secured by blockchain technology'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join groups and discover users in the decentralized ecosystem'
    },
    {
      icon: Zap,
      title: 'Fast & Secure',
      description: 'Lightning-fast messaging with military-grade encryption'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            DeChat
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The future of messaging is here. Connect your wallet and join the decentralized chat revolution.
          </p>
          
          {/* Wallet Connection */}
          <div className="mb-16">
            <WalletConnect />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Connect Wallet</h3>
              <p className="text-muted-foreground">Connect your Web3 wallet to get started</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Create Profile</h3>
              <p className="text-muted-foreground">Set up your custom name and profile picture</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Start Chatting</h3>
              <p className="text-muted-foreground">Discover users and start messaging instantly</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p>Built on Lisk Sepolia • Powered by IPFS • Secured by Blockchain</p>
        </div>
      </div>
    </div>
  );
};