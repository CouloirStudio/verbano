// DraggingContext.tsx

import React, {createContext, ReactNode, useContext, useState} from 'react'; // Define the type of the item being dragged

// Define the type of the item being dragged
export type DraggedItemType = 'note' | 'project' | null;

// Define the shape of the dragging context
interface DraggingContextState {
  draggingItemType: DraggedItemType;
  setDraggingItemType: (itemType: DraggedItemType) => void;
}

// Create the context with a default value
const DraggingContext = createContext<DraggingContextState>({
  draggingItemType: null,
  setDraggingItemType: () => {},
});

// Create a custom hook to use the dragging context
export const useDraggingContext = () => useContext(DraggingContext);

// Define the props for the provider
interface DraggingProviderProps {
  children: ReactNode;
}

// Create a provider component
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
