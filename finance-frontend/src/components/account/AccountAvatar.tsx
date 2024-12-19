import React from "react";
import {Avatar} from "@chakra-ui/react";
import {useAuthentication} from "@/hooks/useAuthentication";

interface AvatarProperties {
    size: string
}

export const AccountAvatar = ({ size }: AvatarProperties) => {
    const { details } = useAuthentication()

    if (!details) {
        return <Avatar size={size} />
    }

    return <Avatar size={size} src={`${process.env.NEXT_PUBLIC_API_URL}/api/users/avatar/${details.username}`} />
}