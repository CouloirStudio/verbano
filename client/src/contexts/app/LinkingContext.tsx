import { createContext, useContext, useState } from "react";

export const LinkingContext = createContext({
  linksList: [],
  linkingState: false,
  createLink: () => {},
  removeLink: () => {},
});
