import { Flex, FlexProps } from "@chakra-ui/react";

interface Props extends FlexProps {}
export const Row = (props: Props) => <Flex direction="row" {...props} />;
