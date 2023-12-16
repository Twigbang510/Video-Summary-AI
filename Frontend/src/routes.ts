import { BasicRoute } from "components/elements/AppRouter";
import Layout from "components/layouts/Layout";
import HomePage from "pages/home/page";

export const routes: BasicRoute[] = [
  {
    path: "/",
    component: Layout,
    exact: false,
    routes: [{ path: "/", label: "Home", component: HomePage, exact: true }],
  },
];
