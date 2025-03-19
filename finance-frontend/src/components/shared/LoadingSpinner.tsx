import {Center, Flex, Spinner, Text} from "@chakra-ui/react";
import {useTheme} from "@/hooks/useTheme";
import {useTranslations} from "next-intl";

export const LoadingSpinner = () => {
  const theme = useTheme()
  const t = useTranslations('Global')
  return (
    <Center h="100vh">
      <Flex direction="column" align="center" justify="center">
        <Spinner
          thickness="3px"
          speed="0.65s"
          emptyColor={theme.text.secondary}
          size={'xl'}
          color={'teal.500'}
          mb={2}
        />
        <Text fontSize="lg" color={theme.text.primary}>
          {t('loading-spinner')}
        </Text>
      </Flex>
    </Center>
  );
};