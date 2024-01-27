import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import { themeExtension } from '@/hooks/theme';
import {AuthenticationProvider} from "@/hooks/authentication"

config.autoAddCss = false;

export default function FinanceApplication({Component, pageProps}: AppProps) {
  return (
    <AuthenticationProvider>
      <ChakraProvider theme={themeExtension}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthenticationProvider>
  );
}