import {Button,Text} from "@chakra-ui/react"
import React from "react"
import {FaTrash} from "react-icons/fa"
import {useTranslations} from "next-intl";

interface DeleteButtonProperties {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  hideText?: boolean
}

export const DeleteButton = ({
  onClick, hideText
}: DeleteButtonProperties) => {
  const t = useTranslations('Global')
  return (
    <Button backgroundColor={'#ea2323'}
            size={'sm'}
            color={'#f8f8f8'} fontWeight={'400'}
            gap={1}
            onClick={onClick}>
      <FaTrash />
      {
        hideText ? null : (
          <Text>
            {t('delete-button')}
          </Text>
        )
      }
    </Button>
  )
}
