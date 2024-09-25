import {PropsWithChildren} from "react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Box} from "@chakra-ui/react"
import {Navbar} from "@/components/Navbar"

interface LayoutProperties {
  isCollapsed?: boolean;
}

export const Layout = ({ children }: PropsWithChildren<LayoutProperties>): ReactJSXElement => {
  return (
    <>
      <Navbar />
      <Box>
        {children}
      </Box>
    </>
  )
}