import { Box, useDisclosure } from "@chakra-ui/react";
import { Col } from "components/elements";
import AppLoginModal from "components/elements/AppLoginModal";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/root-reducer";
import { useLocalStorage } from "usehooks-ts";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const isShowLoadingScreen = useSelector(
    (state: RootState) => state.ui.isShowLoadingScreen
  );
  const initLoading = useSelector((state: RootState) => state.ui.initLoading);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [token, setToken] = useLocalStorage("APP_TOKEN", "");

  const renderSiteContent = () => {
    if (isShowLoadingScreen || initLoading) {
      return null;
    }

    return (
      <Box backgroundColor="#313131" position="relative">
        <Col
          width="fit-content"
          position="absolute"
          top={10}
          right={10}
          color="white"
          cursor="pointer"
          onClick={token ? () => setToken("") : onOpen}
        >
          {token ? "Hello" : "Login"}
        </Col>
        {children}
      </Box>
    );
  };

  return (
    <Box
      pos="relative"
      h="100vh"
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <AppLoginModal isOpen={isOpen} onClose={onClose} />
      {renderSiteContent()}
    </Box>
  );
};

export default Layout;
