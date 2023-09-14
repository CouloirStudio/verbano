import React, {createContext, ReactNode, useContext, useState} from 'react';

interface RecorderContextType {
    currentRecorder: any;
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => void;
    setCurrentRecorder: (recorder: any) => void;
}

const RecorderContext = createContext<RecorderContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const RecorderProvider: React.FC<Props> = ({children}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [currentRecorder, setRecorder] = useState(undefined);

    const setCurrentRecorder = (recorder: any) => setRecorder(recorder);
    const startRecording = () => {
        setIsRecording(true);

    }
    const stopRecording = () => setIsRecording(false);

    return (
        <RecorderContext.Provider
            value={{currentRecorder, isRecording, startRecording, stopRecording, setCurrentRecorder}}>
            {children}
        </RecorderContext.Provider>
    )
};

export const useRecorderContext = (): RecorderContextType => {
    const context = useContext(RecorderContext);
    if (context === undefined) {
        throw new Error('useRecorderContext must be used within a RecorderProvider');
    }
    return context;
};