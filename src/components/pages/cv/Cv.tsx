"use client";

import React from "react";
import CvHead from "./CvHead"; // adjust path as needed

import CvDownload from "./CvDownload";
import About from "./About";
import Education from "./Education";
import Certification from "./Certification";
import Languages from "./Languages";
import ProgrammingLanguages from "./ProgrammingLanguages";
import Experience from "./Experience";
import Projects from "./Projects";
import Others from "./Others";
import Map from "./Map";

import "./Cv.scss";

const gradient =
  "radial-gradient(circle, rgb(25, 58, 89, 0.5) 0%, rgb(0, 0, 0, 0.5) 100%)";

export function Cv({ locale }: { locale: string }) {
  return (
    <>
      <CvHead locale={locale} />

      <section className="have_footer have_NavigationBar cv">
        <CvDownload locale={locale} />
        <div className="cvContainer">
          <About gradient={gradient} />
          <Certification gradient={gradient} />
          <Education gradient={gradient} />
          <Languages gradient={gradient} />
          <ProgrammingLanguages gradient={gradient} />
          <Experience gradient={gradient} />
          <Projects gradient={gradient} />
          <Others gradient={gradient} />
          <Map gradient={gradient} />
        </div>
      </section>
    </>
  );
}

export default Cv;
