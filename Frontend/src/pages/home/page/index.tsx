import { Box, Button, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { Col, Row } from "components/elements";
import { appConfig } from "config";
import { PAGES } from "constants/app";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { colors } from "theme";
import { useLocalStorage } from "usehooks-ts";

// const VideoCard = () => {
//   const history = useHistory();
//   return (
//     <GridItem
//       colSpan={[12, 6, 3]}
//       cursor="pointer"
//       onClick={() => {
//         history.push(PAGES.VIDEO_DETAIL);
//       }}
//     >
//       <Col width="full">
//         <Box pos="relative">
//           <Box>
//             <Image
//               src="https://picsum.photos/seed/59/300/200"
//               className="h-auto w-96"
//               width="24rem"
//               height="auto"
//               alt=""
//             />
//           </Box>

//           <Box
//             as="p"
//             className="py absolute bottom-2 right-2 bg-gray-900 px-1 text-xs text-gray-100"
//             pos="absolute"
//             bottom=".5rem"
//             right=".5rem"
//             backgroundColor="gray.900"
//             paddingX=".25rem"
//             fontSize=".75rem"
//             lineHeight="1rem"
//             color="gray.100"
//           >
//             1:15
//           </Box>
//         </Box>

//         <Row gap=".5rem" marginTop=".5rem">
//           <Box>
//             <Image
//               src="https://picsum.photos/seed/1/40/40"
//               borderRadius="50%"
//               maxH="2.5rem"
//               alt=""
//             />
//           </Box>

//           <Col>
//             <Box>
//               <Box as="p" fontWeight="600" fontSize=".875rem" color="gray.100">
//                 Learn CSS Box Model in 8 Minutes
//               </Box>
//             </Box>
//             <Box
//               className="mt-2 text-xs text-gray-400 hover:text-gray-100"
//               marginTop=".5rem"
//               fontSize=".75rem"
//               lineHeight="1rem"
//               color="gray.400"
//               _hover={{
//                 color: "gray.100",
//               }}
//             >
//               {" "}
//               Web Dev Simplified{" "}
//             </Box>
//             <Box
//               as="p"
//               className="mt-1 text-xs text-gray-400"
//               fontSize=".75rem"
//               lineHeight="1rem"
//               marginTop=".25rem"
//               color="gray.400"
//             >
//               241K views . 3 years ago
//             </Box>
//           </Col>
//         </Row>
//       </Col>
//     </GridItem>
//   );
// };

const HomePage = () => {
  const [videoUrl, setVideoUrl] = useLocalStorage<string>("VIDEO_URL", "");
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${appConfig.url}/metadata`, {
        url: videoUrl,
      });

      history.push({
        pathname: `${PAGES.VIDEO_DETAIL}`,
        search: `?url=${videoUrl}`,
        // @ts-ignore
        state: { videoId: res.data.items[0].id },
      });
    } catch (err) {
      console.log("error: ", err);
    }
    setLoading(false);
  };

  const renderHeroSection = () => {
    return (
      <>
        <Text fontWeight="600" color="white" fontSize={80}>
          SumYou
        </Text>
        <Text fontWeight="500" color="white" fontSize={20}>
          Let&apos;s summarize and save time
        </Text>
        <Row
          pos="relative"
          borderRadius="6px"
          backgroundColor="white"
          marginTop={20}
          width="60vw"
          minW="500px"
          alignItems="center"
        >
          <Col
            pointerEvents="none"
            pos="absolute"
            inset={0}
            zIndex={10}
            justifyContent="center"
            left={5}
          >
            <Box
              as="svg"
              w={4}
              color="gray.400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <Box
                as="path"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </Box>
          </Col>
          <Input
            placeholder="Input Youtube Video URL..."
            display="block"
            width="full"
            padding={4}
            paddingLeft={12}
            fontSize="18px"
            color="black"
            value={videoUrl}
            onChange={handleOnInputChange}
            background="white"
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
            onClick={handleSearch}
            zIndex="10"
            isLoading={loading}
          >
            Import
          </Button>
        </Row>
        <Text fontSize="15px" color="white" marginTop={5}>
          <Box as="b">*Accepted format: https://youtu.be/video_id</Box>
        </Text>
      </>
    );
  };

  return (
    <Col
      paddingTop={140}
      minH="100vh"
      width="full"
      alignItems="center"
      backgroundColor={colors.primaryText}
    >
      {renderHeroSection()}
      {/* <Grid
        marginTop={24}
        maxW="72rem"
        templateColumns="repeat(12, 1fr)"
        gap="0.5rem"
        rowGap="1rem"
      >
        <VideoCard />
      </Grid> */}
    </Col>
  );
};

export default HomePage;
