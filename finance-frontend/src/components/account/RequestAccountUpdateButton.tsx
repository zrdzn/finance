import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  Text,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure, useSteps, Stepper, Step, StepStatus, StepIcon, StepIndicator, StepSeparator,
  Stack,
} from '@chakra-ui/react'
import React, {ChangeEvent, useRef, useState} from "react"
import {FaPlus} from "react-icons/fa"
import {useTheme} from "@/hooks/useTheme"
import {useApi} from "@/hooks/useApi"
import {
  AccountUpdateType,
  CategoryResponse,
  ProductCreateRequest,
  ProductResponse,
  UserEmailUpdateRequest, UserPasswordUpdateRequest
} from "@/components/api"
import {CategorySelect} from "@/components/product/category/CategorySelect"
import toast from "react-hot-toast"
import {FaPencil} from "react-icons/fa6"
import {useAuthentication} from "@/hooks/useAuthentication"
import {useRouter} from "next/router"

interface RequestAccountUpdateButtonProperties {
  accountUpdateType: AccountUpdateType;
}

export const RequestAccountUpdateButton = ({ accountUpdateType }: RequestAccountUpdateButtonProperties) => {
  const theme = useTheme();
  const api = useApi();
  const router = useRouter();
  const { authenticationDetails } = useAuthentication();
  const { isOpen: requestIsOpen, onOpen: requestOnOpen, onClose: requestOnClose } = useDisclosure();
  const { isOpen: verificationIsOpen, onOpen: verificationOnOpen, onClose: verificationOnClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [securityCode, setSecurityCode] = useState("");
  const [userEmailUpdateRequest, setUserEmailUpdateRequest] = useState<UserEmailUpdateRequest>({
    securityCode: "",
    email: ""
  });
  const [userPasswordUpdateRequest, setUserPasswordUpdateRequest] = useState<UserPasswordUpdateRequest>({
    securityCode: "",
    oldPassword: "",
    newPassword: ""
  });

  const steps = [
    { title: 'Enter Security Code', description: 'Security code sent to your email' },
    { title: accountUpdateType === AccountUpdateType.Email ? 'Change Email' : 'Change Password',
      description: accountUpdateType === AccountUpdateType.Email ? 'Update your email' : 'Update your password' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSecurityCodeSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    api.get("/users/update/request")
      .then(response => {
        toast.success(`Security code has been sent to your e-mail`);
        setTimeout(() => {
          requestOnClose();
          verificationOnOpen();
        }, 1000);
      })
      .catch(error => console.error(error));
  };

  const handleUserEmailUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    api.patch("/users/update/email", userEmailUpdateRequest)
      .then(() => {
        toast.success(`E-mail has been updated`);
        setTimeout(() => router.reload(), 1000);
      })
      .catch(error => {
        console.error(error);
        toast.error(`Failed to update e-mail`);
      });
  };

  const handleUserPasswordUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    api.patch("/users/update/password", userPasswordUpdateRequest)
      .then(() => {
        toast.success(`Password has been updated`);
        setTimeout(() => router.reload(), 1000);
      })
      .catch(error => {
        console.error(error);
        toast.error(`Failed to update password`);
      });
  };

  return authenticationDetails && (
    <>
      <Button backgroundColor={theme.primaryColor} onClick={requestOnOpen}>
        <FaPencil />
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={requestIsOpen}
        onClose={requestOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify your e-mail address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              You have to verify your current e-mail address{' '}
              <Text as={'span'} fontWeight={'600'}>{authenticationDetails.email}</Text>{' '}
              in order to proceed further.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSecurityCodeSend}
              backgroundColor={theme.primaryColor}
              mr={3}
            >
              Send code
            </Button>
            <Button onClick={requestOnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={verificationIsOpen}
        onClose={verificationOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {steps[activeStep].title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack gap={4}>
              <Stepper size='sm' index={activeStep}>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus complete={<StepIcon />} />
                    </StepIndicator>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <FormControl isRequired>
                  <Input
                    ref={initialRef}
                    placeholder="Enter your security code"
                    value={securityCode}
                    onChange={(event) => setSecurityCode(event.target.value)}
                  />
                </FormControl>
              )}

              {activeStep === 1 && accountUpdateType === AccountUpdateType.Email && (
                <FormControl isRequired>
                  <FormLabel>New Email</FormLabel>
                  <Input
                    placeholder="New email"
                    value={userEmailUpdateRequest.email}
                    onChange={(event) => setUserEmailUpdateRequest({
                      ...userEmailUpdateRequest,
                      securityCode: securityCode,
                      email: event.target.value,
                    })}
                  />
                </FormControl>
              )}

              {activeStep === 1 && accountUpdateType === AccountUpdateType.Password && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Old Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Old password"
                      value={userPasswordUpdateRequest.oldPassword}
                      onChange={(event) => setUserPasswordUpdateRequest({
                        ...userPasswordUpdateRequest,
                        securityCode: securityCode,
                        oldPassword: event.target.value,
                      })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="New password"
                      value={userPasswordUpdateRequest.newPassword}
                      onChange={(event) => setUserPasswordUpdateRequest({
                        ...userPasswordUpdateRequest,
                        newPassword: event.target.value,
                      })}
                    />
                  </FormControl>
                </>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            {activeStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                mr={3}
              >
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                backgroundColor={theme.primaryColor}
                onClick={handleNextStep}
                mr={3}
              >
                Next
              </Button>
            ) : (
              <Button
                backgroundColor={theme.primaryColor}
                onClick={accountUpdateType === AccountUpdateType.Email
                  ? handleUserEmailUpdate
                  : handleUserPasswordUpdate
                }
                mr={3}
              >
                Submit
              </Button>
            )}
            <Button onClick={verificationOnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};