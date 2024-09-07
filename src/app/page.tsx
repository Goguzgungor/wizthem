"use client"
import { useEffect, useState } from 'react';
import '@dialectlabs/blinks/index.css';
import ViewComponents from "@/app/ViewComponents";

declare global {
    interface Window {
        chrome?: {
            tabs?: {
                query: (queryInfo: {active: boolean, currentWindow: boolean}) => Promise<{url?: string}[]>;
            };
        };
    }
}

export default function Home() {
    const [currentUrl, setCurrentUrl] = useState<string>('Loading...');
    const [isExtension, setIsExtension] = useState(false);

    useEffect(() => {
        const checkEnvironment = async () => {
            if (typeof window !== 'undefined' && window.chrome && window.chrome.tabs) {
                setIsExtension(true);
                try {
                    const tabs = await window.chrome.tabs.query({active: true, currentWindow: true});
                    if (tabs[0] && tabs[0].url) {
                        setCurrentUrl(tabs[0].url);
                    } else {
                        setCurrentUrl('Unable to get URL');
                    }
                } catch (error) {
                    console.error('Error accessing Chrome API:', error);
                    setCurrentUrl('Error: ' + (error as Error).message);
                }
            } else {
                setCurrentUrl(window.location.href);
            }
        };

        checkEnvironment();
    }, []);

    return (
        <div style={{width: '300px', padding: '10px'}}>
            <h1>Chrome Extension</h1>
            <p>Is Extension: {isExtension ? 'Yes' : 'No'}</p>
            <p>Current URL: {currentUrl}</p>
            <ViewComponents />
        </div>
    );
}