import {useCallback} from "react";
import {ScheduleInterval} from "@/api/types";
import {useTranslations} from "next-intl";

export const useIntervalFormatter = () => {
    const t = useTranslations("Units")

    const formatInterval = useCallback((amount: number, interval: ScheduleInterval) => {
        const intervalLabels = {
            HOUR: { singular: t('dates.singular.hour'), plural: t('dates.plural.hour') },
            DAY: { singular: t('dates.singular.day'), plural: t('dates.plural.day') },
            WEEK: { singular: t('dates.singular.week'), plural: t('dates.plural.week') },
            MONTH: { singular: t('dates.singular.month'), plural: t('dates.plural.month') },
            YEAR: { singular: t('dates.singular.year'), plural: t('dates.plural.year') },
        }

        if (!intervalLabels[interval]) {
            throw new Error(`Unsupported interval: ${interval}`);
        }

        const { singular, plural } = intervalLabels[interval];
        return `${amount} ${amount === 1 ? singular : plural}`;
    }, [t])

    return { formatInterval }
}