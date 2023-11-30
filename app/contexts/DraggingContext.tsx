// DraggingContext.tsx

import React, { createContext, ReactNode, useContext, useState } from 'react'; // Define the type of the item being dragged

// Define the type of the item being dragged
export type DraggedItemType = 'note' | 'project' | null;

/**
 * Defines the shape of the DraggingContect
 */
interface DraggingContextType {
  draggingItemType: DraggedItemType;
  setDraggingItemType: (itemType: DraggedItemType) => void;
}

/**
 * Context for dragging items
 */
const DraggingContext = createContext<DraggingContextType>({
  draggingItemType: null,
  setDraggingItemType: () => {},
});

/**
 * A custom hook for accessing DraggingContext and ensuring it is used
 * within the provider.
 *
 * @throws Will throw an error if used outside of DraggingContextProvider
 * @returns {DraggingContextType} the dragging context
 *
 */
export const useDraggingContext = (): DraggingContextType =>
  useContext(DraggingContext);

/**
 * Props for DraggingProvider
 */
interface DraggingProviderProps {
  children: ReactNode;
}

/**
 * A component for providing DraggingContext
 * @param children DraggingProviderProps
 */
export const DraggingProvider: React.FC<DraggingProviderProps> = ({
  children,
}) => {
  const [draggingItemType, setDraggingItemType] =
    useState<DraggedItemType>(null);

  return (
    <DraggingContext.Provider value={{ draggingItemType, setDraggingItemType }}>
      {children}
    </DraggingContext.Provider>
  );
};
