import React, { createContext, ReactNode, useContext } from 'react';
import GetCurrentUser from '@/app/graphql/queries/GetCurrentUser.graphql';
import { IUser } from '@/app/models/User';
import { useQuery } from '@apollo/react-hooks';

const UserContext = createContext<Partial<IUser>>({});

export const useUser = () => {
  return useContext(UserContext);
};

interface UserProviderProps {
  children: ReactNode;
}

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
