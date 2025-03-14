import {extendTheme, useColorModeValue} from "@chakra-ui/react";

interface Theme {
  text: {
    primary: string
    secondary: string
    green: string
    red: string
  }
  background: {
    primary: string
    secondary: string
  }
  primary: string
  secondary: string
}

interface ThemeColors {
  light: {
    text: {
      primary: string
      secondary: string
      green: string
      red: string
    }
    background: {
      primary: string
      secondary: string
    }
    primary: string
    secondary: string
  }

  dark: {
    text: {
      primary: string
      secondary: string
      green: string
      red: string
    }
    background: {
      primary: string
      secondary: string
    }
    primary: string
    secondary: string
  }
}

export const themeColors: ThemeColors = {
  light: {
    text: {
      primary: '#111111',
      secondary: '#4A4A4A',
      green: '#4CAF50',
      red: '#F44336'
    },
    background: {
      primary: 'rgba(243,243,243,0.2)',
      secondary: '#ffffff'
    },
    primary: '#4CAF50',
    secondary: 'rgb(68,166,68)'
  },

  dark: {
    text: {
      primary: '#F8F8F8',
      secondary: '#CCCCCC',
      green: '#4CAF50',
      red: '#F44336'
    },
    background: {
      primary: '#303030',
      secondary: 'rgba(120,120,120,0.32)'
    },
    primary: '#205e20',
    secondary: 'rgba(8,159,66,0.84)'
  }
}

export const themeExtension = extendTheme({
  colors: {
    'light-text-primary': themeColors.light.text.primary,
    'light-text-secondary': themeColors.light.text.secondary,
    'light-text-green': themeColors.light.text.green,
    'light-text-red': themeColors.light.text.red,
    'light-background-primary': themeColors.light.background.primary,
    'light-background-secondary': themeColors.light.background.secondary,
    'light-primary': themeColors.light.primary,
    'light-secondary': themeColors.light.secondary,

    'dark-text-primary': themeColors.dark.text.primary,
    'dark-text-secondary': themeColors.dark.text.secondary,
    'dark-text-green': themeColors.dark.text.green,
    'dark-text-red': themeColors.dark.text.red,
    'dark-background-primary': themeColors.dark.background.primary,
    'dark-background-secondary': themeColors.dark.background.secondary,
    'dark-primary': themeColors.dark.primary,
    'dark-secondary': themeColors.dark.secondary
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark'
          ? 'dark-background-primary'
          : 'light-background-primary',
      }
    })
  }
})

export const useTheme = (): Theme => {
  const textPrimary = useColorModeValue('light-text-primary', 'dark-text-primary')
  const textSecondary = useColorModeValue('light-text-secondary', 'dark-text-secondary')
  const greenColor = useColorModeValue('light-text-green', 'dark-text-green')
  const redColor = useColorModeValue('light-text-red', 'dark-text-red')

  const backgroundPrimary = useColorModeValue('light-background-primary', 'dark-background-primary')
  const backgroundSecondary = useColorModeValue('light-background-secondary', 'dark-background-secondary')

  const primaryColor = useColorModeValue('light-primary', 'dark-primary')
  const secondaryColor = useColorModeValue('light-secondary', 'dark-secondary')

  return {
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      green: greenColor,
      red: redColor
    },
    background: {
      primary: backgroundPrimary,
      secondary: backgroundSecondary,
    },
    primary: primaryColor,
    secondary: secondaryColor
  }
}