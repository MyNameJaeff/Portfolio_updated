"use client";
import LetterGlitch from "@/components/LetterGlitch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
    const router = useRouter();

    // Add data attribute to body to signal 404 page
    useEffect(() => {
        document.body.setAttribute('data-not-found', 'true');
        return () => {
            document.body.removeAttribute('data-not-found');
        };
    }, []);

    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden">
            {/* Glitch Background */}
            <div className="absolute inset-0 h-screen w-screen">
                <LetterGlitch
                    glitchColors={["#7cff67", "#0e6a00", "#1a8f0f"]}
                    glitchSpeed={15}
                    centerVignette={true}
                    outerVignette
                    smooth
                    characters="404ERROR"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
                {/* 404 Text */}
                <div className="relative">
                    <h1 className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(124,255,103,0.5)] md:text-9xl">
                        404
                    </h1>
                    {/* Glitch overlay effect */}
                    <div className="absolute inset-0 text-8xl font-black text-[#7cff67] opacity-50 blur-sm md:text-9xl">
                        404
                    </div>
                </div>

                {/* Subtitle */}
                <div className="max-w-md space-y-2">
                    <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_20px_rgba(124,255,103,0.3)] md:text-3xl">
                        Page Not Found
                    </h2>
                    <p className="text-base text-gray-300 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] md:text-lg">
                        The page you&apos;re looking for has vanished into the digital void.
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => router.back()}
                    className="group relative overflow-hidden rounded-lg border-2 border-[#7cff67] bg-black/50 px-8 py-3 font-semibold text-white shadow-[0_0_20px_rgba(124,255,103,0.3)] transition-all duration-300 hover:bg-[#7cff67] hover:text-black hover:shadow-[0_0_30px_rgba(124,255,103,0.6)]"
                >
                    <span className="relative z-10">Go Back</span>
                    <div className="absolute inset-0 z-0 bg-linear-to-r from-transparent via-[#7cff67]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
            </div>

            {/* Scanline Effect (Optional) */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(124,255,103,0.03)_50%)] bg-[length:100%_4px] opacity-30"></div>
        </div>
    );
}