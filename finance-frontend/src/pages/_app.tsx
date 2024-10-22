import {ChakraProvider} from '@chakra-ui/react';
import {AppProps} from 'next/app';
import {config} from '@fortawesome/fontawesome-svg-core';
import {themeExtension} from '@/hooks/useTheme';
import {AuthenticationProvider} from "@/hooks/useAuthentication"
import {Inter} from "next/font/google"
import {Toaster} from "react-hot-toast"
import {appWithTranslation} from "next-i18next";
import {NextIntlClientProvider} from "next-intl";
import {useRouter} from "next/router";

config.autoAddCss = false;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function FinanceApplication({Component, pageProps}: AppProps) {
    const router = useRouter()

    return <NextIntlClientProvider
        locale={router.locale}
        timeZone="Europe/Warsaw"
        messages={pageProps.messages}
        onError={() => {}}
    >
        <AuthenticationProvider>
            <ChakraProvider theme={themeExtension}>
                <main className={inter.className}>
                    <Component {...pageProps} />
                    <Toaster position={'top-center'} toastOptions={{
                        duration: 3000,
                    }} />
                </main>
            </ChakraProvider>
        </AuthenticationProvider>
    </NextIntlClientProvider>
}