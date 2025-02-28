import {Box, Button, Text, theme} from "@chakra-ui/react"
import React from "react"
import {FaPlus, FaTrash} from "react-icons/fa"
import {useTranslations} from "next-intl";
import {useTheme} from "@/hooks/useTheme";

interface AddButtonProperties {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  size?: string
}

export const AddButton = ({
  onClick, size
}: AddButtonProperties) => {
  const theme = useTheme()
  const t = useTranslations('Global')
  return (
    <Button
      backgroundColor={theme.primaryColor}
      color={'#f8f8f8'}
      fontWeight={'400'}
      size={size || 'md'}
      gap={1}
      minW="auto"
      onClick={onClick}
    >
      <Box as="span" flexShrink={0} display="flex" alignItems="center">
        <FaPlus />
      </Box>
      <Text>
        {t('add-button')}
      </Text>
    </Button>
  )
}
