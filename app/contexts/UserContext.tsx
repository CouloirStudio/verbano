import React, { createContext, ReactNode, useContext } from "react";
import GetCurrentUser from "@/app/graphql/queries/GetCurrentUser.graphql";
import { IUser } from "@/app/models/User";
import { useQuery } from "@apollo/react-hooks";

/**
 * Context for user management
 */
const UserContext = createContext<Partial<IUser>>({});

/**
 * Custom Hook for using the UserContext from within the provider.
 */
export const useUser = () => {
  return useContext(UserContext);
};

/**
 * Props for the UserProvider
 */
interface UserProviderProps {
  children: ReactNode;
}

/**
 * Provider component for UserContext
 * @param children UserProviderProps
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { loading, error, data } = useQuery(GetCurrentUser);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <UserContext.Provider value={data.currentUser}>
      {children}
    </UserContext.Provider>
  );
};
