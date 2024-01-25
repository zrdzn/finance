import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {Layout} from "@/components/Layout";
import Head from 'next/head';
import {
  Button,
  Flex,
  Input, InputGroup, InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import {useTheme} from "@/hooks/theme";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ChangeEvent, useState} from "react";
import {useApi} from "@/hooks/apiClient";

interface PaymentCreateRequest {
  amount: number;
  description: string;
  paymentMethod: string;
}

export default function Dashboard(): ReactJSXElement {
  const theme = useTheme();
  const api = useApi();
  const [paymentCreateRequest, setPaymentCreateRequest] = useState<PaymentCreateRequest>({

  });

  const handlePaymentCreateFields = (event: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <Layout>
      <Head>
        <title>Finance - Dashboard</title>
      </Head>
      <Flex justifyContent={'center'}>
        <Flex direction={'column'} width={'50%'} justifyContent={'center'}>
          <Flex width={'full'}
                height={16}
                marginY={6}
                backgroundColor={'white'}
                border={2}
                borderStyle={'solid'}
                borderColor={'whitesmoke'}>
            <InputGroup>
              <InputLeftElement pointerEvents='none'
                                color='gray.300'
                                fontSize={22}
                                height={'full'}>
                $
              </InputLeftElement>
              <Input height={'full'}
                     placeholder='Enter amount'
                     borderRadius={0}
                     onChange={} />
            </InputGroup>
            <Button backgroundColor={theme.primaryColor}
                    height={'full'}
                    borderRadius={0}>
              Add payment
            </Button>
          </Flex>
          <TableContainer width={'full'}>
            <Table size={'md'} variant='striped' colorScheme='green'>
              <Thead>
                <Tr>
                  <Th>Payment Method</Th>
                  <Th>Payed At</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>BLIK</Td>
                  <Td>09.01.2024</Td>
                  <Td>PLN 25,40</Td>
                  <Td isNumeric>
                    <Flex justifyContent={'end'}
                          gap={3}>
                      <Flex width={5}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Flex>
                      <Flex width={5}>
                        <FontAwesomeIcon icon={faAngleDown} />
                      </Flex>
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Td>CARD</Td>
                  <Td>08.01.2024</Td>
                  <Td>PLN 30,48</Td>
                  <Td isNumeric>
                    <Flex justifyContent={'end'}
                          gap={3}>
                      <Flex width={5}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Flex>
                      <Flex width={5}>
                        <FontAwesomeIcon icon={faAngleDown} />
                      </Flex>
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Td>CARD</Td>
                  <Td>04.01.2024</Td>
                  <Td>PLN 3400,48</Td>
                  <Td isNumeric>
                    <Flex justifyContent={'end'}
                          gap={3}>
                      <Flex width={5}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Flex>
                      <Flex width={5}>
                        <FontAwesomeIcon icon={faAngleDown} />
                      </Flex>
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Flex>
    </Layout>
  );
}