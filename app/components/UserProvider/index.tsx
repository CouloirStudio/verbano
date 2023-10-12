import React, {createContext, useContext} from 'react';
import {CURRENT_USER_QUERY} from "../../../app/graphql/queries/getUsers";
import {IUser} from "@/app/models/User";
import {useQuery} from "@apollo/react-hooks";

const UserContext = createContext<Partial<IUser>>({});

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({children}: any) => {
  const {loading, error, data} = useQuery(CURRENT_USER_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <UserContext.Provider value={data.currentUser}>
      {children}
    </UserContext.Provider>
  );
};
