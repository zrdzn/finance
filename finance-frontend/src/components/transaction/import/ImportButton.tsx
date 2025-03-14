import {Box, Button, HStack, Link, Menu, MenuButton, MenuItem, MenuList, Text, theme} from "@chakra-ui/react"
import React from "react"
import {FaFileImport, FaPlus, FaTrash} from "react-icons/fa"
import {useTranslations} from "next-intl";
import {useTheme} from "@/hooks/useTheme";

interface ImportButtonProperties {
  openCsv: () => void
  openImage: () => void
  size?: string
}

export const ImportButton = ({
  openCsv, openImage, size
}: ImportButtonProperties) => {
  const theme = useTheme()
  const t = useTranslations('Transactions.import')
  return (
    <Menu>
      <MenuButton>
        <Button backgroundColor={theme.secondary}
                color={'#f8f8f8'}
                fontWeight={'400'}
                size={size || 'md'}
                gap={1}>
          <FaFileImport />
          <Text>
            {t('button')}
          </Text>
        </Button>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={openCsv}>{t('csv')}</MenuItem>
        <MenuItem onClick={openImage}>{t('image')}</MenuItem>
      </MenuList>
    </Menu>
  )
}
