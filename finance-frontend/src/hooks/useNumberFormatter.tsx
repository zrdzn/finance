import {useCallback} from "react";
import {useAuthentication} from "@/hooks/useAuthentication";

export const useNumberFormatter = () => {
    const { details } = useAuthentication()

    const formatNumber = useCallback(
        (value: number) => {
            if (!details) {
                return value.toFixed(2);
            }
            
            const [integerPart, decimalPart] = value.toFixed(2).split('.');

            const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, details?.groupSeparator);

            return `${formattedInteger}${details?.decimalSeparator}${decimalPart}`;
        },
        [details]
    );

    return { formatNumber };
}