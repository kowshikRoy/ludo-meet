'use client';
import { useMeetSidePanel } from '@/hooks/useMeetAddon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Play, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SidePanelPage() {
    const { client: meetClient, error: initError } = useMeetSidePanel();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadMainStage = async () => {
        setIsLoading(true);
        setError(null);

        console.log('Meet Client Object:', meetClient); // Debug logging

        if (!meetClient) {
            setError(initError || "Meet Add-on SDK not initialized. Are you in Google Meet?");
            setIsLoading(false);
            return;
        }

        try {
            await meetClient.activity.startActivity({
                mainStageUrl: window.location.origin + '/main-stage'
            });
        } catch (err: any) {
            console.error('Error starting activity', err);
            setError(err.message || "Failed to start activity. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4 max-w-sm mx-auto">
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-indigo-900">
                        🎲 Ludo Meet
                    </CardTitle>
                    <CardDescription>
                        Play Ludo with your team directly in Google Meet!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-[1.02]"
                            size="lg"
                            onClick={loadMainStage}
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Start New Game
                        </Button>
                        
                        <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                            <Users className="w-3 h-3" />
                            Supports up to 4 players
                        </div>

                        {(error || initError) && (
                            <div className="text-xs text-red-500 flex items-center gap-1 justify-center bg-red-50 p-2 rounded">
                                <AlertCircle className="w-3 h-3" />
                                {error || initError}
                            </div>
                        )}

                        {!meetClient && !error && !initError && (
                            <div className="text-xs text-yellow-600 flex items-center gap-1 justify-center bg-yellow-50 p-2 rounded">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Initializing SDK...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
