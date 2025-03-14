import Select, {StylesConfig} from "react-select";
import {themeColors} from "@/hooks/useTheme";

export const ThemedSelect = (props: any) => {
  const styles: StylesConfig = {
    option: (provided, state) => ({
      ...provided,
      color: themeColors.light.text.primary,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: themeColors.light.text.primary,
    }),
  };

  return (
    <Select
      {...props}
      styles={styles}
    />
  )
}