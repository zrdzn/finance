import React, {useState} from "react";
import {Components} from "@/api/api";
import {
    Box,
    Button, ButtonGroup,
    Flex, HStack,
    Popover,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent, PopoverFooter,
    PopoverHeader,
    PopoverTrigger, Table, Tbody, Td, Text, Th, Thead, theme, Tr, useDisclosure
} from "@chakra-ui/react";
import {FaCartPlus, FaPlus} from "react-icons/fa";
import {useTranslations} from "next-intl";
import {AddTransactionProductsButton} from "@/components/transaction/product/AddTransactionProductsButton";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";
import {DeleteButton} from "@/components/shared/DeleteButton";
import toast from "react-hot-toast";
import {useApi} from "@/hooks/useApi";
import {useRouter} from "next/router";
import {EditTransactionProductButton} from "@/components/transaction/product/EditTransactionProductButton";
import {useTheme} from "@/hooks/useTheme";

type VaultResponse = Components.Schemas.VaultResponse;
type TransactionResponse = Components.Schemas.TransactionResponse;
type TransactionProductResponse = Components.Schemas.TransactionProductResponse;

interface TransactionProductsPopoverProperties {
    vault: VaultResponse
    transaction: TransactionResponse;
    permissions: string[];
}

export const TransactionProductsPopover = ({vault, transaction, permissions}: TransactionProductsPopoverProperties) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const t = useTranslations('Transactions')
    const theme = useTheme()
    const { formatNumber } = useNumberFormatter()
    const { api } = useApi()
    const router = useRouter()

    const handleTransactionProductDelete = (transactionProductId: number) => {
        api
          .then(client => client.deleteTransactionProduct({ transactionId: transaction.id, productId: transactionProductId }))
          .then(() => {
              toast.success(t("product.product-deleted-success"))
              setTimeout(() => router.reload(), 1000)
          })
          .catch((error) => {
              console.error(error)
              toast.error(t("product.product-deleted-error"))
          })
    }

    return (
        <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            placement="bottom"
            closeOnBlur={true}
            offset={[0, 10]}
            gutter={0}
            matchWidth={false}
        >
            <PopoverTrigger>
                <Button
                    backgroundColor={'teal.500'}
                    color={'#f8f8f8'}
                    fontWeight={'400'}
                    size={'sm'}
                    gap={1}
                    onClick={onOpen}
                >
                    <FaCartPlus />
                    <Text>{t('table.products.button')}</Text>
                </Button>
            </PopoverTrigger>
            <PopoverContent
              zIndex={1500}
              width={{ base: "300px", md: "350px" }}
              maxWidth={{ base: "95vw", md: "md" }}
              boxShadow="lg"
              backgroundColor={theme.background.secondary}
            >
                <PopoverHeader fontWeight="semibold">
                    {t('table.products.title')}
                </PopoverHeader>
                <PopoverArrow />
                <PopoverBody maxHeight="60vh" overflowY="auto">
                    {transaction.products.products.length === 0 ? (
                        <Box>{t('table.products.no-products')}</Box>
                    ) : (
                        <Flex direction="column" gap={3}>
                            {transaction.products.products.map((product: TransactionProductResponse) => (
                                <Box
                                    key={product.id}
                                    p={4}
                                    borderRadius="md"
                                    boxShadow="md"
                                    backgroundColor={theme.background.primary}
                                >
                                    <Flex justify={'space-between'}>
                                        <Text fontWeight="bold" maxWidth="160px" isTruncated>
                                            x{product.quantity} {product.name}
                                        </Text>
                                        {permissions.includes("TRANSACTION_UPDATE") && (
                                          <HStack spacing={2}>
                                              <EditTransactionProductButton vault={vault} transactionProduct={product} />
                                              <DeleteButton
                                                onClick={() => handleTransactionProductDelete(product.id)}
                                                hideText={true}
                                              />
                                          </HStack>
                                        )}
                                    </Flex>
                                    <Text fontSize="sm" color={theme.text.secondary}>
                                        {product.category?.name}
                                    </Text>
                                    <Flex justify="space-between" mt={2}>
                                        <Text>{formatNumber(product.unitAmount * product.quantity)}</Text>
                                        <Text>{formatNumber(product.unitAmount)}/unit</Text>
                                    </Flex>
                                </Box>
                            ))}
                        </Flex>
                    )}
                </PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end">
                    <ButtonGroup size="sm">
                        {permissions.includes("TRANSACTION_UPDATE") && (
                            <AddTransactionProductsButton
                                vaultId={transaction.vaultId}
                                transactionId={transaction.id}
                                size={'sm'}
                            />
                        )}
                        <Button variant="outline" onClick={onClose}>
                            {t('table.products.close')}
                        </Button>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};