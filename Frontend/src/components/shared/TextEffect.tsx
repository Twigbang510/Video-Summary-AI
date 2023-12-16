import { Box, StyleProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { throwRandomChar } from "utils/string-helper";

interface TextEffectProps extends StyleProps {
  initialValue?: string;
  targetValue: string;
  iterations?: number;
  effectSpeed?: number;
}

const BASE_ITERATIONS = 3;
const BASE_SPEED = 10;

const TextEffect: React.FC<TextEffectProps> = ({
  initialValue,
  targetValue,
  iterations = BASE_ITERATIONS,
  effectSpeed = BASE_SPEED,
  ...rest
}) => {
  const [textString, setTextString] = useState<string>(initialValue);
  let charIndex = 0;
  let indexes: number[] = [];
  let targetChars: string[] = [];
  let resultChars: string[] = initialValue.split("");

  const renderTargetText = () => {
    charIndex = 0;
    const interval = setInterval(() => {
      resultChars[indexes[charIndex]] = targetChars[indexes[charIndex]];
      charIndex++;
      setTextString(resultChars.join(""));
      if (charIndex > targetChars.length - 1) {
        clearInterval(interval);
      }
    }, effectSpeed);
  };

  const decodeText = (remainIterations: number) => {
    charIndex = 0;
    const interval = setInterval(() => {
      resultChars[indexes[charIndex]] = throwRandomChar();
      charIndex++;
      setTextString(resultChars.join(""));
      if (charIndex > targetChars.length - 1) {
        clearInterval(interval);
        remainIterations -= 1;
        if (remainIterations === 0) {
          renderTargetText();
        } else {
          decodeText(remainIterations);
        }
      }
    }, effectSpeed);
  };

  const startDecode = () => {
    targetChars = targetValue.split("");
    indexes = Array.from(Array(targetChars.length).keys());

    shuffleCharOrder(indexes);

    decodeText(iterations);
  };

  function shuffleCharOrder(array: any[]) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  useEffect(() => {
    startDecode();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box {...rest}>
      <Box as="span">{textString}</Box>
    </Box>
  );
};

export default TextEffect;
