import { Box } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/root-reducer";
import { colors } from "theme";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const isShowLoadingScreen = useSelector(
    (state: RootState) => state.ui.isShowLoadingScreen
  );
  const initLoading = useSelector((state: RootState) => state.ui.initLoading);

  const renderSiteContent = () => {
    if (isShowLoadingScreen || initLoading) {
      return null;
    }

    return <Box backgroundColor={colors.alabaster}>{children}</Box>;
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
      {renderSiteContent()}
    </Box>
  );
};

export default Layout;
