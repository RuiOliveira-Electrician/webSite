import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import getFormatDate, {
  formatDate,
  isExpirationDatePassed,
} from "@/utils/getFormatDate.tsx";

import certificationImg from "@/assets/images/cv/certification.jpg";
import { IExpressions } from "@/models/IExpressions";
import { ICertification } from "@/models/IMessages";
import download, { isFileAvailable } from "@/utils/download";

import "./Cv.scss";

interface ICertificationProps {
  gradient: string;
  locale: string;
}

export default function Certification(props: ICertificationProps) {
  const t = useTranslations("");
  const expressions = t.raw("expressions") as IExpressions;
  const certifications = t.raw(
    "certifications.description"
  ) as ICertification[];

  const [showDiplomType, setShowDiplomType] = useState<
    "validDiplom" | "duplicateDiplom" | "expiredDiplom"
  >("validDiplom");

  const toggleDiplomaStatus = () => {
    setShowDiplomType((prev) => {
      switch (prev) {
        case "validDiplom":
          return "duplicateDiplom";
        case "duplicateDiplom":
          return "expiredDiplom";
        case "expiredDiplom":
          return "validDiplom";
        default:
          return "validDiplom";
      }
    });
  };

  const [availableFiles, setAvailableFiles] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    certifications.forEach((certification) => {
      isFileAvailable(
        props.locale,
        "CERTIFICATE",
        certification.downloadTitle
      ).then((exists) => {
        setAvailableFiles((prev) => ({
          ...prev,
          [certification.downloadTitle]: exists,
        }));
      });
    });
  }, [certifications, props.locale]);

  return (
    <div
      className="module"
      style={{
        gridArea: "certification",
        backgroundImage: `url(${certificationImg.src})`,
      }}
    >
      <div
        className={`overlay`}
        style={{
          backgroundImage: `${props.gradient},url(${certificationImg.src})`,
        }}
      >
        <p>{t("certifications.overlayTitle")}</p>
      </div>
      <div className="underlay">
        <button
          className="extraBig bold"
          onClick={toggleDiplomaStatus}
          aria-label="Toggle diploma status"
        >
          {`${t("certifications.underlayTitle")} (${
            expressions.offerTypes[showDiplomType]
          })`}
        </button>
        <p className="text small">{t("certifications.key.changeDiplomas")}</p>
        {certifications.length > 0 ? (
          certifications.map((certification, i) => {
            const isPermanent = certification.expirationDate === "Permanent";
            const isExpired =
              !isPermanent &&
              isExpirationDatePassed(certification.expirationDate);
            const isDuplicate = certification.type.includes("duplicate");

            const shouldShow =
              (showDiplomType === "validDiplom" &&
                !isExpired &&
                !isDuplicate) ||
              (showDiplomType === "duplicateDiplom" &&
                isDuplicate &&
                !isExpired) ||
              (showDiplomType === "expiredDiplom" && isExpired);

            if (shouldShow) {
              const title = isExpired
                ? `${certification.title} (${
                    expressions.offerTypes.expired
                  } ${formatDate(certification.endDate, expressions)})`
                : `${certification.title} (${
                    isPermanent
                      ? expressions.offerTypes.permanent
                      : `${expressions.offerTypes.valid} ${certification.expirationDate}`
                  })`;

              return (
                <React.Fragment key={i}>
                  <div
                    className="certification-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      width: "100%",
                    }}
                  >
                    <div className="certification-info">
                      <p className="light big subTitle">{title}</p>
                      <a
                        className="textGlue medium"
                        target="_blank"
                        rel="noreferrer"
                        href={certification.website}
                        aria-label={`Visit ${certification.companyTitle} website`}
                      >
                        {certification.companyTitle} {certification.company}{" "}
                        {expressions.prepositions.in} {certification.location}
                      </a>
                      <p className="text small">
                        {getFormatDate(certification, expressions)}
                      </p>
                    </div>

                    {availableFiles[certification.downloadTitle] && (
                      <button
                        onClick={download(
                          props.locale,
                          "CERTIFICATE",
                          certification.downloadTitle
                        )}
                        className="download-icon-btn"
                        aria-label="Download certificate"
                        style={{
                          marginLeft: "15px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textDecoration: "none",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    )}
                  </div>
                </React.Fragment>
              );
            }
            return null;
          })
        ) : (
          <p className="text small">{t("certifications.noEducation")}</p>
        )}
      </div>
    </div>
  );
}
