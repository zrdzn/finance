import React, {createContext, useContext, useEffect, useState} from 'react';
import {useApi} from "@/hooks/useApi"
import toast from "react-hot-toast"
import {Components} from "@/api/api";

type AuthenticationDetailsResponse = Components.Schemas.AuthenticationDetailsResponse;

interface AuthenticationContext {
  authenticationDetails: AuthenticationDetailsResponse | null | undefined;
  login: (email: string, password: string, oneTimePassword: string | undefined) => Promise<void>;
  logout: () => Promise<void>
}

const DefaultAuthenticationContext = createContext<AuthenticationContext>({
  authenticationDetails: undefined,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useApi()
  const [authenticationDetails, setAuthenticationDetails] = useState<AuthenticationDetailsResponse | null | undefined>(undefined);

  useEffect(() => {
    if (authenticationDetails === undefined) {
      updateAuthenticationDetails()
    }
  }, [])

  const updateAuthenticationDetails = () => {
    api
      .then(client => client.getAuthenticationDetails())
      .then(response => setAuthenticationDetails(response.data))
      .catch(error => {
        setAuthenticationDetails(null);
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
        .then(() => setAuthenticationDetails(null))
        .catch(error => console.error(error))

    await toast.promise(logoutResult, {
      loading: 'Logging out',
      success: "You\'ve successfully logged out",
      error: "An error occurred while logging out",
    })
  }

  return (
    <DefaultAuthenticationContext.Provider value={{
      authenticationDetails: authenticationDetails,
      login: login,
      logout: logout
    }}>
      {children}
    </DefaultAuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(DefaultAuthenticationContext);
