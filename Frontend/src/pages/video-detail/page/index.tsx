import {
  AspectRatio,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Input,
  Button,
} from "@chakra-ui/react";
import { Col, Row } from "components/elements";
import React from "react";
import { colors } from "theme";

const VideoDetail = () => {
  return (
    <Row minH="100vh" width="full" backgroundColor={colors.primaryText}>
      <Col width="69%" padding={10}>
        <AspectRatio minW="560px" ratio={16 / 9}>
          <iframe
            title="Huyt sao cuc chill"
            src="https://www.youtube.com/embed/QwLvrnlfdNo"
            allowFullScreen
          />
        </AspectRatio>
        <Tabs size="md" variant="enclosed" marginTop={20}>
          <TabList color="white">
            <Tab
              _selected={{
                borderColor: "inherit",
                borderBottom: "1px solid #313131",
              }}
            >
              Summary
            </Tab>
            <Tab
              borderBottom="#313131"
              _selected={{
                borderColor: "inherit",
                borderBottom: "1px solid #313131",
              }}
            >
              Transcript
            </Tab>
          </TabList>
          <TabPanels color="white">
            <TabPanel>
              <p>Summary!</p>
            </TabPanel>
            <TabPanel>
              <p>Transcript!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Col>
      <Box
        border="1px solid"
        borderColor="whiteAlpha.300"
        display="flex"
        flex={1}
        mr={5}
        my={10}
        borderRadius={15}
      >
        <Col alignSelf="flex-end" width="full">
          <Input
            placeholder="Input something"
            borderRadius={0}
            borderLeft={0}
            borderRight={0}
            fontSize="14px"
            fontWeight={400}
            color="white"
            _focusVisible={{
              boxShadow: "none",
            }}
          />
          <Button
            fontWeight={400}
            width="full"
            backgroundColor="whiteAlpha.300"
            color={colors.primaryText}
            borderRadius={0}
            borderBottomLeftRadius={13}
            borderBottomRightRadius={13}
          >
            Submit
          </Button>
        </Col>
      </Box>
    </Row>
  );
};

export default VideoDetail;
