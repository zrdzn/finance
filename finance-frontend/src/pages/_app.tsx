import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import { themeExtension } from '@/hooks/useTheme';
import {AuthenticationProvider} from "@/hooks/useAuthentication"
import {Inter} from "next/font/google"
import {Toaster} from "react-hot-toast"

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
          <Toaster position={'top-center'} toastOptions={{
            duration: 3000,
          }} />
        </main>
      </ChakraProvider>
    </AuthenticationProvider>
  );
}