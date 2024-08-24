import {PropsWithChildren} from "react";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Box} from "@chakra-ui/react"

interface LayoutProperties {
  isCollapsed: boolean;
}

export const Layout = ({ children, isCollapsed }: PropsWithChildren<LayoutProperties>): ReactJSXElement => {
  return (
    <Box
      ml={{ base: 0, md: isCollapsed ? '80px' : '250px' }}
      transition="margin-left 0.3s"
      p={4}
    >
      {children}
    </Box>
  );
};