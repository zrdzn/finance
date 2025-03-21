import {ColorModeScript, ThemeConfig} from '@chakra-ui/react';
import {Head, Html, Main, NextScript} from 'next/document';
import React from 'react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body>
      <ColorModeScript initialColorMode={config.initialColorMode}/>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  )
}