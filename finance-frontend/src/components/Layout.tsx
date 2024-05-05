import {PropsWithChildren} from "react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Sidebar} from "@/components/Sidebar"

interface LayoutProperties {
  hideSidebar?: boolean
}

export const Layout = ({ children, hideSidebar }: PropsWithChildren<LayoutProperties>): ReactJSXElement => {
  return (
    <>
      {!hideSidebar && <Sidebar />}
      {children}
    </>
  );
};