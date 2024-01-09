import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import { themeExtension } from '@/hooks/theme';

config.autoAddCss = false;

export default function FinanceApplication({Component, pageProps}: AppProps) {
  return (
    <ChakraProvider theme={themeExtension}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}