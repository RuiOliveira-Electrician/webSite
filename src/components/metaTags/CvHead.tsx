"use client";

import React from "react";
import Head from "next/head";
import { useTranslations } from "next-intl";

interface CvHeadProps {
  locale: string;
}

export default function CvHead({ locale }: CvHeadProps) {
  const tHome = useTranslations("home");
  const tMeta = useTranslations("meta");

  const baseUrl = process.env.NEXT_PUBLIC_URL || "";
  const canonical = `${baseUrl}/${locale}`;
  const mainImageUrl = `${baseUrl}/favicon/icon-android-chrome-512x512.png`;
  const jobTitle = tHome("subTitle.first");
  const pageTitle = tMeta("app_title");
  const pageDescription = tMeta("app_description");

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: pageTitle,
            jobTitle,
            description: pageDescription,
            url: canonical,
            image: mainImageUrl,
          }),
        }}
      />
    </Head>
  );
}
