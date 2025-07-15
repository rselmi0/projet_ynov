import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../../lib/storage/zustand';

export interface FloatingMenuPosition {
  x: number;
  y: number;
}

interface FloatingMenuState {
  // State
  position: FloatingMenuPosition;
  isExpanded: boolean;
  isDragging: boolean;
  
  // Actions
  setPosition: (position: FloatingMenuPosition) => void;
  setExpanded: (expanded: boolean) => void;
  setDragging: (dragging: boolean) => void;
  toggleExpanded: () => void;
  snapToEdge: (screenWidth: number, buttonSize: number) => void;
  resetPosition: (screenWidth: number, screenHeight: number, buttonSize: number) => void;
}

export const useFloatingMenuStore = create<FloatingMenuState>()(
  persist(
    (set, get) => ({
      // Initial state
      position: { x: 50, y: 100 }, // Default position
      isExpanded: false,
      isDragging: false,

      // Actions
      setPosition: (position: FloatingMenuPosition) => {
        set({ position });
      },

      setExpanded: (expanded: boolean) => {
        set({ isExpanded: expanded });
      },

      setDragging: (dragging: boolean) => {
        set({ isDragging: dragging });
      },

      toggleExpanded: () => {
        set((state) => ({ isExpanded: !state.isExpanded }));
      },

      // Snap button to the nearest edge (left or right)
      snapToEdge: (screenWidth: number, buttonSize: number) => {
        const { position } = get();
        const centerX = position.x + buttonSize / 2;
        const snapToLeft = centerX < screenWidth / 2;
        
        const newX = snapToLeft ? 10 : screenWidth - buttonSize - 10;
        
        set({ 
          position: { 
            ...position, 
            x: newX 
          } 
        });
      },

      // Reset to default position (useful for first time or reset)
      resetPosition: (screenWidth: number, screenHeight: number, buttonSize: number) => {
        set({
          position: {
            x: screenWidth - buttonSize - 20,
            y: screenHeight / 3,
          }
        });
      },
    }),
    {
      name: 'floating-menu-storage',
      storage: createJSONStorage(() => zustandStorage),
      // Only persist position and expanded state, not dragging state
      partialize: (state) => ({ 
        position: state.position, 
        isExpanded: false // Always start collapsed
      }),
    }
  )
); 