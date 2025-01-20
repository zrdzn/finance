import {Button, Text, theme} from "@chakra-ui/react"
import React from "react"
import {FaPlus, FaTrash} from "react-icons/fa"
import {useTranslations} from "next-intl";
import {useTheme} from "@/hooks/useTheme";

interface AddButtonProperties {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const AddButton = ({
  onClick
}: AddButtonProperties) => {
  const theme = useTheme()
  const t = useTranslations('Global')
  return (
      <Button backgroundColor={theme.primaryColor}
              color={'#f8f8f8'}
              fontWeight={'400'}
              size={'md'}
              gap={1}
              onClick={onClick}>
          <FaPlus />
          <Text>
              {t('add-button')}
          </Text>
      </Button>
  )
}
