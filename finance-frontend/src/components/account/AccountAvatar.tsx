import React from "react";
import {Avatar} from "@chakra-ui/react";

interface AvatarProperties {
    size: string,
    userId: number
}

export const AccountAvatar = ({ size, userId }: AvatarProperties) =>
    <Avatar size={size} src={`${process.env.NEXT_PUBLIC_API_URL}/v1/users/avatar/${userId}`} />
