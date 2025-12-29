'use client';
import { useMeetMainStage } from '@/hooks/useMeetAddon';
import LudoBoard from '@/components/LudoBoard';

export default function MainStagePage() {
    const meetClient = useMeetMainStage();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Ludo Meet</h1>
                <LudoBoard />
            </div>
        </div>
    );
}
