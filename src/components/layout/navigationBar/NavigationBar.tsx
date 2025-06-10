"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import { usePathname, routing } from "@/i18n/routing";

import Languages from "../Languages/Language";
import { pageList, Page } from "@/resource/pageList";
import logoImg from "@/assets/images/logo/logo.svg";

import "./NavigationBar.scss";

interface INavigationBarProps {
  locale: string;
}

export default function NavigationBar(props: INavigationBarProps) {
  const t = useTranslations("");
  const pathname = usePathname();
  const currentLanguageCode = props.locale;

  const logoClass = pageList.some(
    (page) =>
      page.name === "homepage" &&
      routing.locales.some((lng) => pathname.endsWith(`/${lng}`))
  )
    ? "thisPage"
    : "notThisPage";

  return (
    <nav className="mainNavigationBar">
      <Link className="iconNavigationBar" href={`/${currentLanguageCode}`}>
        <Image
          src={logoImg}
          className={logoClass}
          width={500}
          height={500}
          alt="Logo"
        />
      </Link>
      <div className="contentNavigationBar">
        {pageList.reduce((urls: ReactNode[], page: Page, i: number) => {
          const pageClass = pathname.endsWith(`${page.url}`)
            ? "thisPage"
            : "notThisPage";
          if (page.navigationBar) {
            urls.push(
              <Link
                key={i}
                className={pageClass}
                href={`/${currentLanguageCode}${page.url === "" ? "" : "/"}${
                  page.url
                }`}
              >
                {t(`navigationBar.${page.name}`)}
              </Link>
            );
          }
          return urls;
        }, [])}
      </div>
      <div className="languageNavigationBar">
        <Languages locale={props.locale} />
      </div>
    </nav>
  );
}
