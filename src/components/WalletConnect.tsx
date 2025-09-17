import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const WalletConnect = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Connect Your Wallet
        </CardTitle>
        <CardDescription>
          Connect your Web3 wallet to access the decentralized chat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button 
                        onClick={openConnectModal} 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                        size="lg"
                      >
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button 
                        onClick={openChainModal} 
                        variant="destructive"
                        className="w-full"
                        size="lg"
                      >
                        Wrong Network
                      </Button>
                    );
                  }

                  return (
                    <div className="flex gap-2">
                      <Button
                        onClick={openChainModal}
                        variant="outline"
                        className="flex-1"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 8,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>

                      <Button
                        onClick={openAccountModal}
                        variant="outline"
                        className="flex-1"
                      >
                        {account.displayName}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </CardContent>
    </Card>
  );
};