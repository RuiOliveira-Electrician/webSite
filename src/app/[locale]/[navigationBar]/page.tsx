import React from "react";
import FadeIn from "@/components/fadeIn/FadeIn";
import { ILocaleProps } from "@/models/ILocaleProps";
import { pageList } from "@/resource/pageList";
import { redirect } from "next/navigation"; 

export default async function LocaleNavigationBarPage({
  params,
}: ILocaleProps) {
  const { locale, navigationBar } = await params;
  const pageName = navigationBar?.toLowerCase() || "homepage";
  const page = pageList.find((p) => p.name.toLowerCase() === pageName);

  if (!page) {
    redirect(`/${locale || "en"}`);
  }

  const PageComponent = page.component;

  const componentProps = pageName === "cv" ? { locale } : {};

  return (
    <FadeIn type="fast">
      <PageComponent {...componentProps} />
    </FadeIn>
  );
}
