'use client'
import React, { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Blink, useAction, Action } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-phantom";

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const ViewComponents: React.FC = () => {
    const [blinkAction, setBlinkAction] = useState<Action | null>(null);
    const actionApiUrl = 'http://localhost:3000/api/actions/donate-sol?to=99Grs8xvqrox8Zgcp2AgBVvWTBdBQp37YNgfzwLmsQ1P';

    // You can use WalletAdapterNetwork.Devnet if you're testing
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => 'https://rpc.ankr.com/solana', []);

    const wallets = useMemo(
        () => [new PhantomWalletAdapter()],
        []
    );

    const BlinkComponent: React.FC = () => {
        const { adapter } = useActionSolanaWalletAdapter(endpoint);
        const { action } = useAction({url: actionApiUrl, adapter});

        return action ? <div style={{ width: '600px', margin: '0 auto' }}> {/* Adjust width as needed */}
                <Blink
                    action={action}
                    websiteText={new URL(actionApiUrl).hostname}
                     // This ensures Blink uses full width of parent
                />
            </div>
            : null;
    }

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div>
                        <h1>Blink Component</h1>
                        <BlinkComponent />
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default ViewComponents;