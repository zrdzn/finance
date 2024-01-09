import {PropsWithChildren} from "react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

export const Layout = ({children}: PropsWithChildren): ReactJSXElement => {
  return (
    <>
      {children}
    </>
  );
};