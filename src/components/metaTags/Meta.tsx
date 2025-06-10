import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta" });

  const baseUrl = process.env.NEXT_PUBLIC_URL || "";
  const pageTitle = t("app_title");
  const pageDescription = t("app_description");
  const keywords = t.raw("keywords") as string[] | undefined;

  const canonical = `${baseUrl}/${locale}`;
  const mainImageUrl = `${baseUrl}/favicon/icon-android-chrome-512x512.png`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        {
          url: "/favicon/icon-16x16.png",
          type: "image/png",
          sizes: "16x16",
        },
        {
          url: "/favicon/icon-32x32.png",
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: "/favicon/icon-android-chrome-192x192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          url: "/favicon/icon-android-chrome-512x512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      apple: [
        {
          url: "/favicon/apple-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: "/favicon/icon-32x32.png",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      type: "website",
      locale,
      siteName: pageTitle,
      images: [
        {
          url: mainImageUrl,
          width: 512,
          height: 512,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [mainImageUrl],
    },
  };
}

export function generateViewport() {
  return {
    themeColor: "#ffffff",
  };
}
