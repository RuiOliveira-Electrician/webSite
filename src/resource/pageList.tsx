import React from "react";

import Home from "@/components/pages/home/Home";
import Cv from "@/components/pages/cv/Cv";

export interface Page {
  navigationBar: boolean;
  name: string;
  url: string;
  component: React.ComponentType<any>;
}

export const pageList: Page[] = [
  {
    navigationBar: true,
    name: "homepage",
    url: "/",
    component: Home,
  },
  {
    navigationBar: true,
    name: "cv",
    url: "/cv",
    component: Cv,
  },
  /*   {
    navigationBar: false,
    name: "portfolio",
    url: "/portfolio",
    component: Cv,
  }, */
];
