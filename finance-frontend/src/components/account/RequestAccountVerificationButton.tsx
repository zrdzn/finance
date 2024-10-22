import {
  Button,

} from '@chakra-ui/react'
import React from "react"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import toast from "react-hot-toast"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useTranslations} from "next-intl";

interface RequestAccountVerificationButtonProperties {
  icon?: React.ReactNode;
  text?: string;
}

export const RequestAccountVerificationButton = ({ icon, text }: RequestAccountVerificationButtonProperties) => {
  const theme = useTheme();
  const api = useApi();
  const { authenticationDetails } = useAuthentication()
  const t = useTranslations("AccountSettings")

  const handleVerificationLinkSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    api.get("/users/verify/request")
      .then(() => {
        toast.success(t('profile-modal.steps.verify.link-sent'))
      })
      .catch(error => console.error(error));
  }

  return authenticationDetails && (
      <Button backgroundColor={theme.primaryColor} onClick={handleVerificationLinkSend} gap={1}>
        {icon && icon}
        {text && text}
      </Button>
  );
};