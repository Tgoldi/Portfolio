import { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface AnimationContextType {
    animationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
    toggleAnimations: () => void;
}

export const AnimationContext = createContext<AnimationContextType>({
    animationsEnabled: true,
    setAnimationsEnabled: () => { },
    toggleAnimations: () => { },
});

interface AnimationProviderProps {
    children: ReactNode;
}

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
    const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);

    const toggleAnimations = () => {
        setAnimationsEnabled(prev => !prev);
    };

    // Apply a CSS class to document when animations are disabled
    useEffect(() => {
        if (!animationsEnabled) {
            document.documentElement.classList.add('animations-disabled');
        } else {
            document.documentElement.classList.remove('animations-disabled');
        }
    }, [animationsEnabled]);

    return (
        <AnimationContext.Provider
            value={{
                animationsEnabled,
                setAnimationsEnabled,
                toggleAnimations
            }}
        >
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimations = () => useContext(AnimationContext); 