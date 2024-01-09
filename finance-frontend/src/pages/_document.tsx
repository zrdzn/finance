import { ColorModeScript, ThemeConfig } from '@chakra-ui/react';
import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import {themeColors} from "@/hooks/theme";

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

export default function Document(): ReactJSXElement {
  return (
    <Html lang="en">
      <Head/>
      <body style={{backgroundColor: themeColors.lightBackground}}>
      <ColorModeScript initialColorMode={config.initialColorMode}/>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  );
}