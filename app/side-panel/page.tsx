'use client';
import { useMeetSidePanel } from '@/hooks/useMeetAddon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Play } from 'lucide-react';

export default function SidePanelPage() {
    const meetClient = useMeetSidePanel();

    const loadMainStage = async () => {
        if (!meetClient) return;
        try {
            // In a real app, you'd generate a session ID or specific URL
            await meetClient.activity.startActivity({
                mainStageUrl: window.location.origin + '/main-stage'
            });
        } catch (err) {
            console.error('Error starting activity', err);
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
