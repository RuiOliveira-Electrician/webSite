import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import download, { isFileAvailable } from "@/utils/download";

import "./Cv.scss";
import "./CvButton.scss";

export default function CvDownload({ locale }: { locale: string }) {
  const t = useTranslations("");
  const [cvExists, setCvExists] = useState<boolean>(false);

  useEffect(() => {
    isFileAvailable(locale, "CV")
      .then((exists) => setCvExists(exists))
      .catch(() => setCvExists(false));
  }, [locale]);

  if (!cvExists) return null;

  return (
    <div className="download">
      <button className="learn-more buttonCV" onClick={download(locale, "CV")}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span id="buttonCV" className="buttonCV-text">
          {t("home.cvButton")}
        </span>
      </button>
    </div>
  );
}
