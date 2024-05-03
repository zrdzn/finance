import React, { createContext, useContext, useState, useEffect } from 'react';
import {useApi} from "@/hooks/apiClient"

interface AuthenticationDetails {
  email: string | undefined;
  username: string | undefined;
}

interface AuthenticationContext {
  authenticationDetails: AuthenticationDetails | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>
}

const DefaultAuthenticationContext = createContext<AuthenticationContext>({
  authenticationDetails: undefined,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useApi();
  const [authenticationDetails, setAuthenticationDetails] = useState<AuthenticationDetails | undefined>(undefined);

  useEffect(() => {
    if (authenticationDetails === undefined) {
      updateAuthenticationDetails()
    }
  });

  const updateAuthenticationDetails = () => {
    api.get("/authentication/details")
      .then(response => setAuthenticationDetails(response.data))
      .catch(error => {
        setAuthenticationDetails(undefined)
        console.error(error)
      })
  }

  const login = async (email: string, password: string): Promise<void> => {
    api.post("/authentication/login", {
      email: email,
      password: password
    })
      .then(() => updateAuthenticationDetails())
      .catch(error => console.error(error))
  };

  const logout = async (): Promise<void> => {
    api.post("/authentication/logout")
      .then(() => setAuthenticationDetails(undefined))
      .catch(error => console.error(error))
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