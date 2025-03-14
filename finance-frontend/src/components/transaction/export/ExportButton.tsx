import {Box, Button, HStack, Link, Menu, MenuButton, MenuItem, MenuList, Text, theme} from "@chakra-ui/react"
import React from "react"
import {FaFileExport, FaFileImport, FaPlus, FaTrash} from "react-icons/fa"
import {useTranslations} from "next-intl";
import {useTheme} from "@/hooks/useTheme";

interface ExportButtonProperties {
  openCsv: () => void
  size?: string
}

export const ExportButton = ({
  openCsv, size
}: ExportButtonProperties) => {
  const theme = useTheme()
  const t = useTranslations('Transactions.export')
  return (
    <Menu>
      <MenuButton>
        <Button backgroundColor={theme.secondary}
                color={'#f8f8f8'}
                fontWeight={'400'}
                size={size || 'md'}
                gap={1}>
          <FaFileExport />
          <Text>
            {t('button')}
          </Text>
        </Button>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={openCsv}>{t('csv')}</MenuItem>
      </MenuList>
    </Menu>
  )
}
