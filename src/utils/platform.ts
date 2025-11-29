/**
 * Platform detection utility
 * Detects whether the app is running in Electron or in a web browser
 */

export const isElectron = (): boolean => {
    // Check if window.electron exists (injected by Electron's preload script)
    if (typeof window !== 'undefined' && (window as any).electron) {
        return true;
    }

    // Check user agent for Electron
    if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')) {
        return true;
    }

    // Check for process.versions.electron (Node.js context)
    if (typeof process !== 'undefined' && process.versions && (process.versions as any).electron) {
        return true;
    }

    return false;
};

export const isWeb = (): boolean => {
    return !isElectron();
};
