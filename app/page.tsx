import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <main className="max-w-md w-full text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Ludo Meet
        </h1>
        <p className="text-lg text-slate-600">
          A Ludo game Add-on for Google Meet.
        </p>
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
            <h2 className="font-semibold mb-2">Development Links</h2>
            <div className="flex flex-col gap-2">
              <Link href="/side-panel">
                <Button variant="outline" className="w-full">Open Side Panel</Button>
              </Link>
              <Link href="/main-stage">
                <Button variant="outline" className="w-full">Open Main Stage</Button>
              </Link>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            <p>Note: This app is designed to run inside Google Meet.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
