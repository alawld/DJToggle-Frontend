import { useEffect, useRef, useState } from 'react';
import { repl } from '@strudel/core';
import { initAudioOnFirstClick, doughsamples } from '@strudel/webaudio';

export function useStrudel() {
    const [isPlaying, setIsPlaying] = useState(false);
    const schedulerRef = useRef(null);

    useEffect(() => {
        // Configure local samples if URL is provided
        const samplesUrl = import.meta.env.VITE_STRUDEL_SAMPLES_URL;
        if (samplesUrl) {
            console.log("Using custom Strudel samples URL:", samplesUrl);
            doughsamples(samplesUrl);
        }

        // Initialize Strudel REPL
        const { scheduler } = repl({
            defaultOutput: initAudioOnFirstClick(),
        });
        schedulerRef.current = scheduler;

        // Expose Strudel functions to global scope for eval
        import('@strudel/core').then((module) => {
            Object.assign(window, module);
        });

        return () => {
            scheduler.stop();
        };
    }, []);

    const updatePattern = (patternString) => {
        if (schedulerRef.current) {
            try {
                // Eval the string in the global scope where Strudel functions are now available
                // We wrap it in a function if needed, but simple expressions work
                schedulerRef.current.setPattern(eval(patternString));
            } catch (e) {
                console.error("Failed to update pattern", e);
            }
        }
    };

    const togglePlay = () => {
        if (schedulerRef.current) {
            if (isPlaying) {
                schedulerRef.current.stop();
            } else {
                schedulerRef.current.start();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return { isPlaying, togglePlay, updatePattern };
}
