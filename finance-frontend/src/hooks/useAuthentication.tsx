import React, {createContext, useContext, useEffect, useState} from 'react';
import {useApi} from "@/hooks/useApi"
import toast from "react-hot-toast"
import {Components} from "@/api/api";

type UserResponse = Components.Schemas.UserResponse;

interface AuthenticationContext {
  details: UserResponse | null | undefined;
  login: (email: string, password: string, oneTimePassword: string | undefined) => Promise<void>;
  logout: () => Promise<void>
}

const DefaultAuthenticationContext = createContext<AuthenticationContext>({
  details: undefined,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useApi()
  const [details, setDetails] = useState<UserResponse | null | undefined>(undefined);

  useEffect(() => {
    if (details === undefined) {
      updateAuthenticationDetails()
    }
  }, [])

  const updateAuthenticationDetails = () => {
    api
      .then(client => client.getAuthenticationDetails())
      .then(response => setDetails(response.data))
      .catch(error => {
        setDetails(null);
        console.error(error);
      })
  }

  const login = (email: string, password: string, oneTimePassword: string | undefined): Promise<void> => {
    return api
      .then(client => client.login(null, { email, password, oneTimePassword }))
      .then(() => {
        updateAuthenticationDetails()
        toast.success("You've successfully logged in")
      })
  }

  const logout = async (): Promise<void> => {
    const logoutResult = api
        .then(client => client.logout())
        .then(() => setDetails(null))
        .catch(error => console.error(error))

    await toast.promise(logoutResult, {
      loading: 'Logging out',
      success: "You\'ve successfully logged out",
      error: "An error occurred while logging out",
    })
  }

  return (
    <DefaultAuthenticationContext.Provider value={{
      details: details,
      login: login,
      logout: logout
    }}>
      {children}
    </DefaultAuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(DefaultAuthenticationContext);
