import React from "react";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import AppShell from "@/components/layout/AppShell";
import NavigationBar from "@/components/layout/navigationBar/NavigationBar";
import Footer from "@/components/layout/footer/Footer";

import "@/assets/styles/globalVar.scss";
import "@/assets/styles/global.css";

interface ILayoutProps {
  children: React.ReactNode;
}

export { generateMetadata } from "@/components/metaTags/Meta";

export default async function Layout({ children }: ILayoutProps) {
  const locale = await getLocale();
  setRequestLocale(locale);
  const messages = await getMessages();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone={timeZone}
        >
          <AppShell locale={locale}>
            <div className="wideGrid">
              <NavigationBar locale={locale} />
              {children}
              <Footer />
            </div>
          </AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}