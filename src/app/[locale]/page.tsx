import React from "react";

import FadeIn from "@/components/fadeIn/FadeIn";
import { pageList } from "@/resource/pageList";

import { ILocaleProps } from "@/models/ILocaleProps";

export default async function LocaleHomepage({ params }: ILocaleProps) {
  const { locale } = await params;
  const page = pageList.find((p) => p.name.toLowerCase() === "homepage");

  if (!page) {
    return <div>Page not found</div>;
  }

  const PageComponent = page.component;

  const componentProps = { locale };

  return (
    <FadeIn type="fast">
      <PageComponent {...componentProps} />
    </FadeIn>
  );
}
