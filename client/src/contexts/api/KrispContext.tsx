import { createContext, useContext, useState } from "react";

export const KrispContext = createContext({
  provideNoiseReductionService: async () => {},
});
