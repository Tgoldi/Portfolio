import React, { useState, useEffect } from 'react';
import { X, Moon, Minus, Plus, Underline, AlignJustify, RotateCcw, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimations } from '@/contexts/AnimationContext';

interface AccessibilityMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ isOpen, onClose }) => {
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [highlightLinks, setHighlightLinks] = useState(false);
    const [readableFont, setReadableFont] = useState(false);
    
    // Use the global animation context instead of local state
    const { animationsEnabled, toggleAnimations } = useAnimations();

    // Handle font size changes
    const increaseFontSize = () => {
        if (fontSize < 150) {
            const newSize = fontSize + 10;
            setFontSize(newSize);
            document.documentElement.style.fontSize = `${newSize}%`;
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > 90) {
            const newSize = fontSize - 10;
            setFontSize(newSize);
            document.documentElement.style.fontSize = `${newSize}%`;
        }
    };

    // Handle contrast changes
    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
        document.documentElement.classList.toggle('high-contrast');
    };

    // Handle link highlighting
    const toggleHighlightLinks = () => {
        setHighlightLinks(!highlightLinks);
        document.documentElement.classList.toggle('highlight-links');
    };

    // Handle readable font
    const toggleReadableFont = () => {
        setReadableFont(!readableFont);
        document.documentElement.classList.toggle('readable-font');
    };

    // Reset all accessibility settings
    const resetSettings = () => {
        setFontSize(100);
        setHighContrast(false);
        setHighlightLinks(false);
        setReadableFont(false);
        
        // Reset animations to enabled state
        if (!animationsEnabled) {
            toggleAnimations();
        }
        
        document.documentElement.style.fontSize = '100%';
        document.documentElement.classList.remove('high-contrast');
        document.documentElement.classList.remove('highlight-links');
        document.documentElement.classList.remove('readable-font');
    };

    // Close the menu with Escape key
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEscapeKey);
        return () => window.removeEventListener('keydown', handleEscapeKey);
    }, [isOpen, onClose]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-background/95 z-50 overflow-auto"
            aria-modal="true"
            role="dialog"
            aria-label="Accessibility options"
        >
            <div className="max-w-md mx-auto p-5 my-10 bg-card border border-border rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Accessibility Options</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-muted"
                        aria-label="Close accessibility menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Display Settings</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                        onClick={toggleHighContrast}
                        className={cn(
                            "flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors",
                            highContrast && "border-primary bg-primary/10"
                        )}
                        aria-pressed={highContrast}
                    >
                        <Moon className="h-10 w-10 mb-2" />
                        <span>High Contrast</span>
                    </button>
                    
                    <button 
                        onClick={resetSettings}
                        className="flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors"
                        aria-label="Reset all accessibility settings"
                    >
                        <RotateCcw className="h-10 w-10 mb-2" />
                        <span>Reset All</span>
                    </button>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Content Settings</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                        onClick={decreaseFontSize}
                        className="flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors"
                        aria-label="Decrease text size"
                    >
                        <Minus className="h-10 w-10 mb-2" />
                        <span>Decrease Text</span>
                    </button>
                    
                    <button 
                        onClick={increaseFontSize}
                        className="flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors"
                        aria-label="Increase text size"
                    >
                        <Plus className="h-10 w-10 mb-2" />
                        <span>Increase Text</span>
                    </button>
                    
                    <button 
                        onClick={toggleHighlightLinks}
                        className={cn(
                            "flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors",
                            highlightLinks && "border-primary bg-primary/10"
                        )}
                        aria-pressed={highlightLinks}
                    >
                        <Underline className="h-10 w-10 mb-2" />
                        <span>Highlight Links</span>
                    </button>
                    
                    <button 
                        onClick={toggleReadableFont}
                        className={cn(
                            "flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors",
                            readableFont && "border-primary bg-primary/10"
                        )}
                        aria-pressed={readableFont}
                    >
                        <AlignJustify className="h-10 w-10 mb-2" />
                        <span>Readable Font</span>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={toggleAnimations}
                        className={cn(
                            "flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors",
                            !animationsEnabled && "border-primary bg-primary/10"
                        )}
                        aria-pressed={!animationsEnabled}
                    >
                        {animationsEnabled ? (
                            <>
                                <Pause className="h-10 w-10 mb-2" />
                                <span>Stop Animations</span>
                            </>
                        ) : (
                            <>
                                <Play className="h-10 w-10 mb-2" />
                                <span>Enable Animations</span>
                            </>
                        )}
                    </button>
                </div>
                
                <div className="mt-8 text-center">
                    <a 
                        href="/accessibility" 
                        className="text-primary underline"
                        onClick={() => onClose()}
                    >
                        View Full Accessibility Statement
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityMenu; 