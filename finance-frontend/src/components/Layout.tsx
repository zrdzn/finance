import {PropsWithChildren} from "react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Sidebar} from "@/components/Sidebar"

export const Layout = ({children}: PropsWithChildren): ReactJSXElement => {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
};