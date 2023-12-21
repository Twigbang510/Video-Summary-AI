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
import axios from "axios";
import { useLocalStorage } from "usehooks-ts";
import { appConfig } from "config";

const AppLoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [token, setToken] = useLocalStorage("APP_TOKEN", "");
  const [isSignIn, setIsSignIn] = useState(true);
  const [signUpInfo, setSignUpInfo] = useState({
    email: undefined,
    password: undefined,
  });

  const [signInInfo, setSignInInfo] = useState({
    email: undefined,
    password: undefined,
  });

  const handleToggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSignUp = async () => {
    const resAction = await axios.post(`${appConfig.url}/signup`, signUpInfo);
  };

  const handleSignIn = async () => {
    const resAction = await axios.post(`${appConfig.url}/login`, signInInfo);

    if (resAction.status === 200) {
      setToken(resAction.data.token);
      onClose();
    }
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
                value={signInInfo.email}
                onChange={(event) =>
                  setSignInInfo({ ...signInInfo, email: event.target.value })
                }
              />
            </FormControl>
            <PasswordField
              value={signInInfo.password}
              onChange={(event) =>
                setSignInInfo({ ...signInInfo, password: event.target.value })
              }
            />
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="text" size="sm">
              Forgot password?
            </Button>
          </HStack>
          <Stack spacing="6">
            <Button
              color="white"
              background={colors.primaryText}
              onClick={handleSignIn}
            >
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
                value={signUpInfo.email}
                onChange={(event) =>
                  setSignUpInfo({ ...signUpInfo, email: event.target.value })
                }
              />
            </FormControl>
            <PasswordField
              value={signUpInfo.password}
              onChange={(event) =>
                setSignUpInfo({ ...signUpInfo, password: event.target.value })
              }
            />
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="text" size="sm">
              Forgot password?
            </Button>
          </HStack>
          <Stack spacing="6">
            <Button
              color="white"
              background={colors.primaryText}
              onClick={handleSignUp}
            >
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
