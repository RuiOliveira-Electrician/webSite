"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { VcardGenerator } from "@/components/vcard/vcardGenerator/VcardGenerator";
import { useTranslations } from "next-intl";

import { IVcard } from "@/models/IVcard";

import "./Vcard.scss";

export default function VcardPage({
  locale,
  vcardCode,
}: {
  locale: string;
  vcardCode: string;
}) {
  const t = useTranslations();
  const vcard = t.raw("vcard") as IVcard;
  const router = useRouter();
  const filename = `Rui_Oliveira_Vcard.vcf`;
  const vcardSuffix = vcardCode || "default";

  const [timer, setTimer] = useState(5);
  const [errors, setErrors] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const vCardLink = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const generateVCard = async () => {
      try {
        const vCardData = await VcardGenerator(vcardSuffix);
        if (vCardData) {
          const blob = new Blob([vCardData], { type: "text/vcard" });
          const url = URL.createObjectURL(blob);
          setFileUrl(url);

          if (vCardLink.current) {
            vCardLink.current.href = url;
            vCardLink.current.download = filename;
            vCardLink.current.click();
          }

          return () => URL.revokeObjectURL(url);
        } else {
          throw new Error("Generated vCard data is empty");
        }
      } catch (error) {
        console.error("Error generating vCard:", error);
        setErrors(true);
      }
    };

    generateVCard();
  }, [vcardSuffix]);

  useEffect(() => {
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);

    if (timer === 0) {
      router.replace("/", { locale });
    }

    return () => clearInterval(countdown);
  }, [timer, locale, router]);

  const resetTimer = () => setTimer(5);

  return (
    <div className="centerVcard">
      <div className="titleTextVcard">{vcard.redirectMessage}</div>

      <div className="timerTextVcard">
        {`${vcard.redirectCountdownTitle} ${timer} ${vcard.redirectCountdownUnit} ...`}
      </div>

      {!errors ? (
        <a
          className="vcardDownloadTextVcard"
          ref={vCardLink}
          href={fileUrl || undefined}
          download={filename}
        >
          {vcard.downloadPrompt}
        </a>
      ) : (
        <>
          <p className="textErrorVcard">{vcard.error}</p>
          <p className="vcardDownloadTextVcard">{vcard.errorMessage}</p>
        </>
      )}
    </div>
  );
}
