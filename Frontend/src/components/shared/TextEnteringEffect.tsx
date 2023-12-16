import { Box, BoxProps, Text, TextProps } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextEnteringEffectProps extends TextProps {
  children: React.ReactNode;
  easeValue?: any;
  delayValue?: number;
  durationValue?: number;
  containerProps?: BoxProps;
}

export const TextEnteringEffect = ({
  children,
  easeValue = [1, 0, 0, 1],
  durationValue = 1.8,
  delayValue = 0,
  containerProps,
  ...textProps
}: TextEnteringEffectProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const renderContent = () => {
    if (typeof children === "string") {
      return <Text {...textProps}>{children}</Text>;
    }
    return children;
  };

  return (
    <Box ref={ref} overflow="hidden" {...containerProps}>
      {isInView && (
        <motion.div
          initial={{ y: "100px" }}
          animate={{
            y: "0",
            transition: {
              duration: durationValue,
              ease: easeValue,
              delay: delayValue,
            },
          }}
        >
          {renderContent()}
        </motion.div>
      )}
    </Box>
  );
};
