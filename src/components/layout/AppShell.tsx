"use client";

import React from "react";
import classNames from "classnames";
import { Inter } from "next/font/google";
import Loading from "../Loading/Loading";
import FadeIn from "@/components/fadeIn/FadeIn";
import { useLoadingAnimation } from "@/hooks/useLoadingAnimation"; // Import the hook

const inter = Inter({ subsets: ["latin"] });

interface IAppShellProps {
  children: React.ReactNode;
  locale: string;
}

export default function AppShell({ children, locale }: IAppShellProps) {
  const { animationDuration } = useLoadingAnimation("20s", 2500);

  return (
    <div
      style={
        { "--loadingAnimation": animationDuration } as React.CSSProperties
      }
      className={classNames(inter.className, "overflow-y-scroll")}
    >
      <Loading>
        <div id="root" className="flex flex-col min-h-screen mx-auto">
          <FadeIn type="slow">
            <div className="flex-grow">{children}</div>
          </FadeIn>
        </div>
      </Loading>
    </div>
  );
}
