import React, { createContext, useContext, useState, useEffect } from 'react';
import {useApi} from "@/hooks/apiClient"

interface AuthenticationDetails {
  email: string | undefined;
  username: string | undefined;
}

interface AuthenticationContext {
  email: string | undefined;
  username: string | undefined;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const DefaultAuthenticationContext = createContext<AuthenticationContext>({
  email: undefined,
  username: undefined,
  login: () => {},
  logout: () => {},
});

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useApi();
  const [authenticationDetails, setAuthenticationDetails] = useState<AuthenticationDetails | null>({
    email: undefined,
    username: undefined,
  });

  useEffect(() => {
    api.get("/authentication/details")
      .then(response => setAuthenticationDetails(response.data))
      .catch(error => console.error(error))
  }, []);

  const login = (email: string, password: string): void => {
    api.post("/authentication/login", {email, password})
      .then(response => setAuthenticationDetails(response.data))
      .catch(error => console.error(error))
  };

  const logout = (): void => {
    setAuthenticationDetails(null);
  };

  return (
    <DefaultAuthenticationContext.Provider value={{
      email: authenticationDetails?.email,
      username: authenticationDetails?.username,
      login,
      logout
    }}>
      {children}
    </DefaultAuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(DefaultAuthenticationContext);