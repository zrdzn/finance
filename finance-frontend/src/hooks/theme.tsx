import {extendTheme, useColorModeValue} from "@chakra-ui/react";

interface Theme {
  textColor: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeColors {
  lightText: string;
  lightBackground: string;
  lightPrimary: string;
  lightSecondary: string;

  darkText: string;
  darkBackground: string;
  darkPrimary: string;
  darkSecondary: string;
}

export const themeColors: ThemeColors = {
  lightText: '#000000',
  lightBackground: 'rgba(238,255,239,0.32)',
  lightPrimary: 'rgba(11,210,89,0.7)',
  lightSecondary: '#C6F6D5',

  darkText: '#000000',
  darkBackground: 'rgba(238,255,239,0.32)',
  darkPrimary: 'rgba(11,210,89,0.7)',
  darkSecondary: '#C6F6D5'
};

export const themeExtension = extendTheme({
  colors: {
    'light-text': themeColors.lightText,
    'light-background': themeColors.lightBackground,
    'light-primary': themeColors.lightPrimary,
    'light-secondary': themeColors.lightSecondary,

    'dark-text': themeColors.darkText,
    'dark-background': themeColors.darkBackground,
    'dark-primary': themeColors.darkPrimary,
    'dark-secondary': themeColors.darkSecondary
  }
});

export const useTheme = (): Theme => {
  const textColor = useColorModeValue('light-text', 'dark-text');
  const backgroundColor = useColorModeValue('light-background', 'dark-background');
  const primaryColor = useColorModeValue('light-primary', 'dark-primary');
  const secondaryColor = useColorModeValue('light-secondary', 'dark-secondary');

  return {
    textColor: textColor,
    backgroundColor: backgroundColor,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor
  };
};