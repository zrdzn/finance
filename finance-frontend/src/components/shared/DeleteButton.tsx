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
    <Button backgroundColor={'red'}
            size={'md'}
            color={'#f8f8f8'} fontWeight={'400'}
            onClick={onClick}>
      <FaTrash />
    </Button>
  )
}
