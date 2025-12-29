'use client';
import { motion } from 'framer-motion';
import { PlayerColor } from '@/lib/ludoGame';
import { cn } from '@/lib/utils';

// Colors for pieces
const COLORS = {
    red: "bg-red-600 border-red-800",
    green: "bg-green-600 border-green-800",
    yellow: "bg-yellow-500 border-yellow-700",
    blue: "bg-blue-600 border-blue-800"
};

export default function LudoPiece({ 
    color, 
    x, 
    y, 
    onClick, 
    isClickable,
    isStack // If multiple pieces on same spot, we might stack
}: { 
    color: PlayerColor; 
    x: number; 
    y: number; 
    onClick?: () => void;
    isClickable?: boolean;
    isStack?: boolean
}) {
    // 15x15 grid means each cell is ~6.66% ??
    // We can use gridColumnStart / gridRowStart
    
    return (
        <motion.div
            layout
            className={cn(
                "absolute rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)] z-10 cursor-pointer flex items-center justify-center border-2",
                COLORS[color],
                isClickable && "ring-4 ring-white/50 animate-pulseHover",
                "w-[80%] h-[80%] m-[10%]"
            )}
            style={{
                gridColumnStart: x + 1,
                gridRowStart: y + 1,
            }}
            initial={false}
            animate={{ 
                scale: isClickable ? 1.1 : 1,
                zIndex: isClickable ? 20 : 10
            }}
            whileHover={isClickable ? { scale: 1.2 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={onClick}
        >
             <div className="w-[60%] h-[60%] rounded-full bg-white/30" />
        </motion.div>
    );
}
