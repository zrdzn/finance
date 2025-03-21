import {PropsWithChildren} from "react";
import {Box} from "@chakra-ui/react"
import {Navbar} from "@/components/Navbar"

interface LayoutProperties {
  isCollapsed?: boolean;
}

export const Layout = ({ children }: PropsWithChildren<LayoutProperties>) => {
  return (
    <>
      <Navbar />
      <Box>
        {children}
      </Box>
    </>
  )
}