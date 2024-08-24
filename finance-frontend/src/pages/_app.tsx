import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import { themeExtension } from '@/hooks/theme';
import {AuthenticationProvider} from "@/hooks/authentication"
import {Inter} from "next/font/google"

config.autoAddCss = false;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function FinanceApplication({Component, pageProps}: AppProps) {
  return (
    <AuthenticationProvider>
      <ChakraProvider theme={themeExtension}>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </ChakraProvider>
    </AuthenticationProvider>
  );
}