import {Button,} from "@chakra-ui/react"
import React from "react"
import {FaTrash} from "react-icons/fa"

interface DeleteButtonProperties {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const DeleteButton = ({
  onClick
}: DeleteButtonProperties) => {
  return (
    <Button colorScheme={'red'}
            size={'md'}
            onClick={onClick}>
      <FaTrash />
    </Button>
  )
}