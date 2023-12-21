import {
  AspectRatio,
  Badge,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Spinner,
  Center,
  Button,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { Col, Row } from "components/elements";
import { appConfig } from "config";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { colors } from "theme";
import { useEffectOnce, useReadLocalStorage } from "usehooks-ts";

type TranscriptEntry = {
  text: string;
  start: number;
  duration: number;
};

type FormattedEntry = {
  text: string;
  timestamp: string;
};

function formatTimestamp(seconds: number): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

function processTranscript(transcript: TranscriptEntry[]): FormattedEntry[] {
  return transcript.map((entry) => ({
    text: entry.text,
    timestamp: formatTimestamp(entry.start),
  }));
}

const VideoDetail = () => {
  const videoUrl = useReadLocalStorage<string>("VIDEO_URL");
  const { state } = useLocation();
  let params = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingTrans, setLoadingTrans] = useState(false);
  const [loadingOpenAI, setLoadingOpenAI] = useState(false);
  const [openAIKey, setOpenAIKey] = useState("");
  const [transcript, setTranscript] = useState<any>([]);
  const [summary, setSummary] = useState([]);
  const [summaryOpenAI, setSummaryOpenAI] = useState({ summaryText: "" });

  const fetchSummaryOpenAI = async () => {
    if (openAIKey === "") {
      return;
    }
    setLoadingOpenAI(true);
    try {
      const res = await axios.post(`${appConfig.url}/summarize/openai`, {
        url: videoUrl,
        openai_api_key: openAIKey,
      });

      console.log(res.data);
      // @ts-ignore
      setSummaryOpenAI(res.data);
    } catch (err) {
      console.log("error: ", err);
    }
    setLoadingOpenAI(false);
  };

  useEffectOnce(() => {
    const fetchTranscript = async () => {
      setLoadingTrans(true);
      try {
        const res = await axios.post(`${appConfig.url}/get-transcript`, {
          url: videoUrl,
        });

        setTranscript(processTranscript(res.data));
      } catch (err) {
        console.log("error: ", err);
      }
      setLoadingTrans(false);
    };

    fetchTranscript();
  });

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${appConfig.url}/summarize`, {
          url: videoUrl,
        });

        setSummary(res.data);
      } catch (err) {
        console.log("error: ", err);
      }
      setLoading(false);
    };

    if (transcript.length > 0) {
      fetchSummary();
    }
  }, [videoUrl, transcript.length]);

  return (
    <Row minH="100vh" width="full" backgroundColor={colors.primaryText}>
      <Col width="69%" padding={10}>
        <AspectRatio minW="560px" ratio={16 / 9}>
          <iframe
            title="Embedded video"
            // @ts-ignore
            src={`https://www.youtube.com/embed/${state.videoId}`}
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
              Summary with OpenAI
            </Tab>
          </TabList>
          <TabPanels color="white">
            <TabPanel>
              <Box padding={5} minHeight="200px">
                {loading ? (
                  <Center alignItems="center">
                    <Spinner />
                  </Center>
                ) : (
                  <>
                    {summary.map((trans: any) => (
                      <Row
                        gap="10px"
                        mb={10}
                        alignItems="center"
                        key={trans.start}
                      >
                        <Badge
                          colorScheme="green"
                          width="fit-content"
                          height={4}
                        >
                          {trans.start}
                        </Badge>
                        <Row>
                          <Text color="white">{trans.text}</Text>
                        </Row>
                      </Row>
                    ))}
                  </>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Row
                  pos="relative"
                  borderRadius="6px"
                  backgroundColor="black"
                  marginTop={4}
                  width="60vw"
                  minW="500px"
                  alignItems="center"
                >
                  <Input
                    placeholder="Input OpenAI key..."
                    display="block"
                    width="full"
                    padding={4}
                    fontSize="18px"
                    color="white"
                    value={openAIKey}
                    onChange={(event) => setOpenAIKey(event.target.value)}
                    background="black"
                    border="none"
                    _focusVisible={{
                      boxShadow: "none",
                    }}
                  />
                  <Button
                    margin={2}
                    borderRadius="10px"
                    backgroundColor="red.700"
                    paddingX={5}
                    fontSize="15px"
                    color="white"
                    _hover={{
                      backgroundColor: "red.900",
                    }}
                    onClick={fetchSummaryOpenAI}
                    zIndex="10"
                    isLoading={loadingOpenAI}
                  >
                    Summarize
                  </Button>
                </Row>
                <Box whiteSpace="pre-wrap" marginTop={14}>
                  {summaryOpenAI.summaryText}
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Col>
      <Box
        border="1px solid"
        borderColor="whiteAlpha.300"
        display="flex"
        flexDirection="column"
        flex={1}
        mr={5}
        my={10}
        borderRadius={15}
        padding={5}
        overflowY="scroll"
        maxH="90vh"
      >
        {loadingTrans ? (
          <Center alignItems="center" minHeight="300px">
            <Spinner color="white" />
          </Center>
        ) : (
          transcript.map((trans: FormattedEntry) => (
            <Row gap="10px" mb={10} alignItems="center" key={trans.timestamp}>
              <Badge colorScheme="green" width="fit-content" height={4}>
                {trans.timestamp}
              </Badge>
              <Row>
                <Text color="white">{trans.text}</Text>
              </Row>
            </Row>
          ))
        )}
        {/* <Col alignSelf="flex-end" width="full">
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
        </Col> */}
      </Box>
    </Row>
  );
};

export default VideoDetail;
