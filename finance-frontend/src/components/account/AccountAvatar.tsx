import React from "react";
import {Avatar} from "@chakra-ui/react";

interface AvatarProperties {
    size: string,
    username?: string
}

export const AccountAvatar = ({ size, username }: AvatarProperties) => {
    if (!username) {
        return <Avatar size={size} />
    }

    return <Avatar size={size} src={`${process.env.NEXT_PUBLIC_API_URL}/api/users/avatar/${username}`} />
}