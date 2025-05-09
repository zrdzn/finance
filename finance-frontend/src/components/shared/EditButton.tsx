import {Button, Text} from "@chakra-ui/react"
import React from "react"
import {FaEdit} from "react-icons/fa"
import {useTranslations} from "next-intl";
import {useTheme} from "@/hooks/useTheme";

interface EditButtonProperties {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  hideText?: boolean
}

export const EditButton = ({
  onClick, hideText
}: EditButtonProperties) => {
  const theme = useTheme()
  const t = useTranslations('Global')
  return (
    <Button backgroundColor={'blue.500'}
            color={'#f8f8f8'}
            fontWeight={'400'}
            size={'sm'}
            gap={1}
            onClick={onClick}>
      <FaEdit />
      {
        hideText ? null : (
          <Text>
            {t('edit-button')}
          </Text>
        )
      }
    </Button>
  )
}
