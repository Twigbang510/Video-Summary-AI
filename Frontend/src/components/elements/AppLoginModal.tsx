import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "components/shared/PasswordField";
import { colors } from "theme";

const AppLoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleToggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  const renderSignIn = () => {
    if (!isSignIn) {
      return null;
    }

    return (
      <Box py={{ base: "0", sm: "8" }} px={{ base: "4", sm: "10" }}>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                borderColor="gray.200"
                boxShadow={{ base: "md" }}
                _hover={{
                  borderColor: "gray.300",
                }}
              />
            </FormControl>
            <PasswordField />
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="text" size="sm">
              Forgot password?
            </Button>
          </HStack>
          <Stack spacing="6">
            <Button color="white" background={colors.primaryText}>
              Sign in
            </Button>
            <HStack>
              <Divider />
              <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                Don't have an account?{" "}
                <Text
                  as="span"
                  color="red.700"
                  cursor="pointer"
                  onClick={handleToggleMode}
                >
                  Sign up
                </Text>
              </Text>
              <Divider />
            </HStack>
          </Stack>
        </Stack>
      </Box>
    );
  };

  const renderSignUp = () => {
    if (isSignIn) {
      return null;
    }

    return (
      <Box py={{ base: "0", sm: "8" }} px={{ base: "4", sm: "10" }}>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                borderColor="gray.200"
                boxShadow={{ base: "md" }}
                _hover={{
                  borderColor: "gray.300",
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                border="1px solid"
                borderColor="gray.200"
                boxShadow={{ base: "md" }}
                _hover={{
                  borderColor: "gray.300",
                }}
                _autofill={{
                  border: "1px solid #E2E8F0",
                  background: "white",
                  textFillColor: "black",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
            </FormControl>
            <PasswordField />
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="text" size="sm">
              Forgot password?
            </Button>
          </HStack>
          <Stack spacing="6">
            <Button color="white" background={colors.primaryText}>
              Sign up
            </Button>
            <HStack>
              <Divider />
              <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                Don't have an account?{" "}
                <Text
                  as="span"
                  color="red.700"
                  cursor="pointer"
                  onClick={handleToggleMode}
                >
                  Sign in
                </Text>
              </Text>
              <Divider />
            </HStack>
          </Stack>
        </Stack>
      </Box>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          backgroundColor="white"
          borderRadius={{ base: "none", sm: "xl" }}
        >
          {renderSignIn()}
          {renderSignUp()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AppLoginModal;
