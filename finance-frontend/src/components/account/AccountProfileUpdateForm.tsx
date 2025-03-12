import {Components} from "@/api/api";
import React, {useState} from "react";
import {Button, FormControl, FormLabel, HStack, Input, Radio, RadioGroup, Stack, Text} from "@chakra-ui/react";
import {AccountAvatar} from "@/components/account/AccountAvatar";
import {FileUpload} from "@/components/shared/FileUpload";
import {FaPencil} from "react-icons/fa6";
import {RequestAccountUpdateButton} from "@/components/account/RequestAccountUpdateButton";
import {FaEdit, FaEnvelope, FaKey, FaLock, FaSave} from "react-icons/fa";
import {RequestAccountVerificationButton} from "@/components/account/RequestAccountVerificationButton";
import toast from "react-hot-toast";
import {useApi} from "@/hooks/useApi";
import {useRouter} from "next/router";
import {useTranslations} from "next-intl";
import {useTheme} from "@/hooks/useTheme";
import {useAuthentication} from "@/hooks/useAuthentication";

export type UserProfileUpdateRequest = Components.Schemas.UserProfileUpdateRequest;
export type UserResponse = Components.Schemas.UserResponse;

interface AccountProfileUpdateFormProperties {
    user: UserResponse
}

export const AccountProfileUpdateForm = ({ user }: AccountProfileUpdateFormProperties) => {
    const api = useApi()
    const t = useTranslations("AccountSettings")
    const router = useRouter()
    const theme = useTheme()
    const { details } = useAuthentication()
    const [userProfileUpdateRequest, setUserProfileUpdateRequest] = useState<UserProfileUpdateRequest>({
        username: user.username,
        decimalSeparator: user.decimalSeparator,
        groupSeparator: user.groupSeparator
    })
    const [isEditingUsername, setIsEditingUsername] = useState(false)

    const handleUsernameChange = (username: string) => {
        setUserProfileUpdateRequest((previous) => ({ ...previous, username: username }))
    }

    const handleDecimalSeparatorChange = (decimalSeparator: string) => {
        setUserProfileUpdateRequest((previous) => ({ ...previous, decimalSeparator: decimalSeparator }))
    }

    const handleGroupSeparatorChange = (groupSeparator: string) => {
        setUserProfileUpdateRequest((previous) => ({ ...previous, groupSeparator: groupSeparator }))
    }

    const handleUserProfileUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        api
            .then(client => client.updateUserProfile(null, userProfileUpdateRequest)
                .then(() => {
                    toast.success(t('profile-card.updated-success'))
                    setTimeout(() => router.reload(), 1000)
                }))
            .catch(error => {
                console.error(error)
                toast.error(t('profile-card.updated-error'))
            })
    }

    const handleAvatarUpload = (avatarFile: File) => {
        const form = new FormData()

        form.append("avatar", avatarFile)

        api
            .then(client => client.api.client.put("api/users/avatar", form))
            .then(() => router.reload())
            .catch(error => {
                const errorMessage = error.response?.data?.message
                toast.error(errorMessage)
            })
    }

    return (
        <Stack spacing='4'>
          {
            details && (
              <FormControl>
                <FormLabel>{t('profile-card.avatar-label')}</FormLabel>
                <HStack gap={4}>
                  <AccountAvatar size={'xl'} userId={details?.id} />
                  <FileUpload handleFile={it => handleAvatarUpload(it)}>
                    <Button size={'md'}
                            backgroundColor={theme.primaryColor}
                            gap={1}
                            color={'#f8f8f8'} fontWeight={'400'}>
                      <FaPencil />
                    </Button>
                  </FileUpload>
                </HStack>
              </FormControl>
            )
          }
            <FormControl isRequired>
                <FormLabel>{t('profile-card.email-label')}</FormLabel>
                <HStack>
                    <Input
                        name={'email'}
                        defaultValue={user.email}
                        isDisabled
                    />
                    <RequestAccountUpdateButton icon={<FaEdit />} accountUpdateType={'EMAIL'} />
                </HStack>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>{t('profile-card.username-label')}</FormLabel>
                <HStack>
                    <Input
                        name={'username'}
                        onChange={(event) => handleUsernameChange(event.target.value)}
                        placeholder={t('profile-card.username-placeholder')}
                        defaultValue={user.username}
                        isDisabled={!isEditingUsername}
                    />
                    <Button
                        backgroundColor={theme.primaryColor}
                        onClick={event => {
                            if (isEditingUsername) {
                                handleUserProfileUpdate(event)
                            }

                            setIsEditingUsername(!isEditingUsername)}
                        }
                        size={'md'}
                        color={'#f8f8f8'} fontWeight={'400'}
                    >
                        {
                            isEditingUsername ? <FaSave /> : <FaPencil />
                        }
                    </Button>
                </HStack>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>{t('profile-card.password-label')}</FormLabel>
                <HStack>
                    <RequestAccountUpdateButton icon={<FaKey />} text={t('profile-card.password-placeholder')} accountUpdateType={'PASSWORD'} />
                </HStack>
            </FormControl>
            <FormControl>
                <FormLabel>{t('profile-card.verify-label')}</FormLabel>
                <HStack>
                    {user.verified && <Text fontSize={'sm'} color={'green'}>{t('profile-card.already-verified')}</Text>}
                    {!user.verified && (
                        <RequestAccountVerificationButton icon={<FaEnvelope />} text={t('profile-card.verify-link')} />
                    )}
                </HStack>
            </FormControl>
            <FormControl>
                <FormLabel>{t('profile-card.two-factor-setup-label')}</FormLabel>
                <HStack>
                    {user.isTwoFactorEnabled && <Text fontSize={'sm'} color={'green'}>{t('profile-card.two-factor-already-enabled')}</Text>}
                    {!user.isTwoFactorEnabled && (
                        <RequestAccountUpdateButton icon={<FaLock />} text={t('profile-card.two-factor-setup-button-label')}  accountUpdateType={"TWO_FACTOR"}/>
                    )}
                </HStack>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>{t('profile-card.group-separator-label')}</FormLabel>
                <RadioGroup
                    name="groupSeparator"
                    value={userProfileUpdateRequest.groupSeparator}
                    onChange={handleGroupSeparatorChange}
                >
                    <Stack direction="row" spacing={3}>
                        <Radio value=",">{t('profile-card.comma-label')}</Radio>
                        <Radio value=".">{t('profile-card.dot-label')}</Radio>
                        <Radio value=" ">{t('profile-card.space-label')}</Radio>
                    </Stack>
                </RadioGroup>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>{t('profile-card.decimal-separator-label')}</FormLabel>
                <RadioGroup
                    name="decimalSeparator"
                    value={userProfileUpdateRequest.decimalSeparator}
                    onChange={handleDecimalSeparatorChange}
                >
                    <Stack direction="row" spacing={3}>
                        <Radio value=",">{t('profile-card.comma-label')}</Radio>
                        <Radio value=".">{t('profile-card.dot-label')}</Radio>
                    </Stack>
                </RadioGroup>
            </FormControl>
            <Button
                backgroundColor={theme.primaryColor}
                onClick={handleUserProfileUpdate}
                size={'md'}
                gap={1}
                color={'#f8f8f8'} fontWeight={'400'}
            >
                <FaSave />
                <Text>{t('profile-card.save-preferences')}</Text>
            </Button>
        </Stack>
    )
}