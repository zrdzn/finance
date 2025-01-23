import React, {useState} from "react";
import {Components} from "@/api/api";
import {
    Box,
    Button, ButtonGroup,
    Flex,
    Popover,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent, PopoverFooter,
    PopoverHeader,
    PopoverTrigger, Table, Tbody, Td, Text, Th, Thead, theme, Tr, useDisclosure
} from "@chakra-ui/react";
import {FaCartPlus, FaPlus} from "react-icons/fa";
import {FaBagShopping} from "react-icons/fa6";
import {useTranslations} from "next-intl";
import {AddTransactionProductsButton} from "@/components/transaction/product/AddTransactionProductsButton";
import {useNumberFormatter} from "@/hooks/useNumberFormatter";

type TransactionResponse = Components.Schemas.TransactionResponse;
type TransactionProductResponse = Components.Schemas.TransactionProductResponse;

interface TransactionProductsPopoverProperties {
    transaction: TransactionResponse;
    permissions: string[];
}

export const TransactionProductsPopover = ({transaction, permissions}: TransactionProductsPopoverProperties) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const t = useTranslations('Transactions')
    const { formatNumber } = useNumberFormatter()

    return (
        <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            placement="bottom"
            closeOnBlur={true}
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
            <PopoverContent position="absolute" zIndex={'10'} left={'-160px'}>
                <PopoverHeader fontWeight="semibold">
                    {t('table.products.title')}
                </PopoverHeader>
                <PopoverArrow />
                <PopoverBody>
                    {transaction.products.products.length === 0 ? (
                        <Box>{t('table.products.no-products')}</Box>
                    ) : (
                        <Flex direction="column" gap={3}>
                            {transaction.products.products.map((product: TransactionProductResponse) => (
                                <Box
                                    key={product.id}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    boxShadow="sm"
                                    bg="white"
                                    _hover={{ boxShadow: "md" }}
                                >
                                    <Text fontWeight="bold">
                                        x{product.quantity} {product.product.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {product.product.categoryName}
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