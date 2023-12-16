import { BasicRoute } from "components/elements/AppRouter";
import Layout from "components/layouts/Layout";
import { PAGES } from "constants/app";
import HomePage from "pages/home/page";
import VideoDetail from "pages/video-detail/page";

export const routes: BasicRoute[] = [
  {
    path: "/",
    component: Layout,
    exact: false,
    routes: [
      { path: "/", label: "Home", component: HomePage, exact: true },
      { path: PAGES.VIDEO_DETAIL, component: VideoDetail, exact: true },
    ],
  },
];
