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
    <div className="min-h-screen bg-gradient-to-br from-background to-card text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DeChat
          </h1>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/auth'}
              className="border-primary/50 hover:bg-primary/10"
            >
              Sign In
            </Button>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Decentralized Chat for the{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Future
          </span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience true ownership and privacy with our Web3-powered chat platform. 
          Connect your wallet and join the revolution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-lg px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            onClick={() => window.location.href = '/auth'}
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 border-primary/50 hover:bg-primary/10"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Why Choose DeChat?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border/50 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Connect Wallet</h3>
              <p className="text-muted-foreground">Connect your Web3 wallet to get started</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Create Profile</h3>
              <p className="text-muted-foreground">Set up your custom name and profile picture</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Start Chatting</h3>
              <p className="text-muted-foreground">Discover users and start messaging instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-border/50">
        <p>Built on Lisk Sepolia • Powered by IPFS • Secured by Blockchain</p>
      </footer>
    </div>
  );
};