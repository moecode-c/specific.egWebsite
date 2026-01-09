"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000); // Show for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#05030a]"
                >
                    <div className="relative h-32 w-32 overflow-hidden rounded-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.jpg"
                            alt="Loading..."
                            className="h-full w-full object-cover"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
