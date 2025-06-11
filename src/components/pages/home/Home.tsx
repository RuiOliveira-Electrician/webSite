"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import "./Home.scss";

import homeImg from "@/assets/images/home/main.jpg";

export function Home() {
  const t = useTranslations("");

  return (
    <section className="have_footer have_NavigationBar home">
      <header>
        <figure>
          <Image
            src={homeImg}
            className="frontImage"
            width={500}
            height={500}
            alt="Rui Oliveira"
            priority
          />
        </figure>
      </header>
      <main>
        <h1 className="title"> {t("home.title")}</h1>
        <h2
          className="subTitle first"
          data-texteffect={t("home.subTitle.first")}
        >
          {t("home.subTitle.first")}
        </h2>
        <h3
          className="subTitle second"
          data-texteffect={t("home.subTitle.second")}
        >
          {t("home.subTitle.second")}
        </h3>
        <h3
          className="subTitle third"
          data-texteffect={t("home.subTitle.third")}
        >
          {t("home.subTitle.third")}
        </h3>
      </main>
    </section>
  );
}

export default Home;
