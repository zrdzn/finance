import {ColorModeScript, ThemeConfig} from '@chakra-ui/react';
import {Head, Html, Main, NextScript} from 'next/document';
import React from 'react';
import {ReactJSXElement} from '@emotion/react/types/jsx-namespace';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

export default function Document(): ReactJSXElement {
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