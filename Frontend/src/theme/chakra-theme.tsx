import {
  Colors,
  extendTheme,
  ThemeComponents,
  ThemeConfig,
  withDefaultColorScheme,
  withDefaultSize,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const fonts = {
  heading: "CircularStd",
  body: "Poppins",
};
const colors: Colors = {
  gray: {
    700: "#1f2733",
  },
  main: {
    50: "#fff9dd",
    100: "#ffecb0",
    200: "#ffdf80",
    300: "#ffd24f",
    400: "#ffc521",
    500: "#e6ac0c",
    600: "#b38604",
    700: "#805f00",
    800: "#4d3900",
    900: "#1d1300",
  },
  google: {
    blue: "#4285F4",
    red: "#DB4437",
    green: "#0F9D58",
    yellow: "#F4B400",
  },
};
const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5625rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "2.5rem",
  "6xl": "3.75rem",
  "7xl": "4.375rem",
  "8xl": "5rem",
  "9xl": "5.625rem",
};
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: (props: any) => ({
    body: {
      color: mode("#313131", "#313131")(props),
      bg: mode("gray.100", "#ffffff")(props),
    },
    "*, *::before, ::after": {
      wordWrap: "normal",
    },
  }),
};

const components: ThemeComponents = {
  Text: {
    defaultProps: {
      size: "md",
    },
  },
  Badge: {
    sizes: {
      md: {
        width: "65px",
        height: "25px",
      },
    },
    baseStyle: {
      textTransform: "capitalize",
    },
  },
  Input: {
    baseStyle: {
      field: {
        _autofill: {
          border: "unset",
          textFillColor: "black",
          boxShadow: "0 0 0px 1000px white inset",
          transition: "background-color 5000s ease-in-out 0s",
        },
      },
    },
  },
};

const sizes = {
  container: {
    xl: "1350px",
  },
};
export const uiTheme = extendTheme(
  { colors, config, components, fonts, sizes, fontSizes, styles },
  withDefaultColorScheme({ colorScheme: "harry" }),
  withDefaultSize({ size: "lg" })
);
