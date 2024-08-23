import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem,
  AccordionPanel,
  Box, Button,
  Card,
  CardBody,
  CardHeader, Divider,
  Flex,
  Heading, HStack,
  Link,
  Stack,
  StackDivider, Tag, TagLabel, TagLeftIcon,
  Text
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {VaultMemberResponse} from "@/components/api"
import {useApi} from "@/hooks/apiClient"
import {EditProductButton} from "@/components/product/EditProductButton"
import {useRouter} from "next/router"
import {DeleteButton} from "@/components/shared/DeleteButton"

interface MembersCardItemProperties {
  member: VaultMemberResponse
  permissions: string[]
}

export const MembersCardItem = ({
  member,
  permissions
}: MembersCardItemProperties) => {
  const api = useApi()
  const router = useRouter()

  const handleMemberDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    api.delete(`/vaults/${member.vaultId}/members/${member.id}`)
      .then(() => router.reload())
      .catch(error => console.error(error))
  }

  return (
    <Accordion allowToggle width={'full'}>
      <AccordionItem width={'full'}
                     paddingY={4}
                     borderTop={'none'}>
          <AccordionButton width={'full'}>
            <Box width={'full'}>
              <Flex justifyContent={'space-between'}
                    alignItems={'center'}>
                <Flex w={'full'}
                      gap={3}
                      alignItems={'center'}>
                  <Heading size='sm'
                           maxWidth={'70%'}>
                    {member.user.username}
                  </Heading>
                  <HStack spacing={4}>
                    {
                      member.role === 'OWNER' &&
                        <Tag size={'sm'} colorScheme='red'>
                            <TagLabel>Owner</TagLabel>
                        </Tag>
                    }
                    {
                      member.role === 'MANAGER' &&
                        <Tag size={'sm'} colorScheme='purple'>
                            <TagLabel>Manager</TagLabel>
                        </Tag>
                    }
                    {
                      member.role === 'MEMBER' &&
                        <Tag size={'sm'} colorScheme='green'>
                            <TagLabel>Member</TagLabel>
                        </Tag>
                    }
                  </HStack>
                </Flex>
                <HStack spacing={2}>
                  {
                    member.role !== 'OWNER' &&
                    permissions.includes("MEMBER_REMOVE") &&
                    <DeleteButton onClick={handleMemberDelete} />
                  }
                </HStack>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Text color={'dimgray'}
                      fontSize={'sm'}
                      letterSpacing={0.2}>
                  {member.user.email}
                </Text>
              </Flex>
            </Box>
          </AccordionButton>
      </AccordionItem>
    </Accordion>
  )
}