import { useContext } from "react";
import { KrispContext } from '../contexts/api/KrispContext';

function useKrisp() {
    const context = useContext(KrispContext);
    const reduceNoise = async () => {
      // call the provideNoiseReductionService of KrispContext
    };
  
    return {
      reduceNoise,
    };
}