import React, { createContext, useContext, useState, useEffect } from 'react';
import {useApi} from "@/hooks/useApi"
import {AuthenticationDetails} from "@/components/api"
import toast from "react-hot-toast"

interface AuthenticationContext {
  authenticationDetails: AuthenticationDetails | null | undefined;
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
  const [authenticationDetails, setAuthenticationDetails] = useState<AuthenticationDetails | null | undefined>(undefined);

  useEffect(() => {
    if (authenticationDetails === undefined) {
      updateAuthenticationDetails()
    }
  });

  const updateAuthenticationDetails = () => {
    api.get("/authentication/details")
      .then(response => setAuthenticationDetails(response.data))
      .catch(error => {
        setAuthenticationDetails(null)
        console.error(error)
      })
  }

  const login = async (email: string, password: string): Promise<void> => {
    const loginResult = api.post("/authentication/login", {
      email: email,
      password: password
    })
      .then(() => updateAuthenticationDetails())
      .catch(error => {
        console.error(error)
        throw error
      })

    await toast.promise(loginResult, {
      loading: 'Logging in',
      success: "You\'ve successfully logged in",
      error: "Credentials you've provided are incorrect",
    })
  };

  const logout = async (): Promise<void> => {
    const logoutResult = api.post("/authentication/logout")
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