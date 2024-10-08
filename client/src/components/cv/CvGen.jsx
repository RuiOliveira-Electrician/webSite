
import React from "react";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { defaultLanguage, supportedLngs } from "../../resource/lngs"

import "./Cv.scss";
import "./CvButton.scss";

const server = process.env.REACT_APP_API;
export default function CvGen(props) {
  const supportedLngsKeys = {}
  for (const lang of supportedLngs) {
    supportedLngsKeys[lang] = props.i18n.store.data[lang]?.translation
  }
  const { t } = useTranslation();

  const createAndDownloadPdf = (e) => {
    e.preventDefault();

    for (const lang of supportedLngs) {
      const defaultTranslationKeys = supportedLngsKeys[defaultLanguage]
      const translationKeys = supportedLngsKeys[lang]
      if (!translationKeys || !defaultTranslationKeys) continue;
      // TODO: remove page refresh

      let cvData = {
        currentLanguageCode: lang,
        app_title: translationKeys.app_title,
        title: translationKeys.home.subTitle.first,
        profile: translationKeys.about.description.cv,
        languages: deepMergeArray(defaultTranslationKeys.languages.description, translationKeys.languages.description),
        languagesKey: deepMergeObject(defaultTranslationKeys.languages.key, translationKeys.languages.key),
        characteristics: deepMergeObject(defaultTranslationKeys.characteristics, translationKeys.characteristics),
        // programmingLanguages: deepMergeObject(defaultTranslationKeys.programmingLanguages.description, translationKeys.programmingLanguages.description),
        skills: deepMergeArray(defaultTranslationKeys.skills, translationKeys.skills),
        educations: deepMergeArray(defaultTranslationKeys.education.description, translationKeys.education.description),
        experiences: deepMergeArray(defaultTranslationKeys.experience.description, translationKeys.experience.description),
        projects: deepMergeArray(defaultTranslationKeys.projects.description, translationKeys.projects.description),
        others: deepMergeArray(defaultTranslationKeys.other.description, translationKeys.other.description),
        expressions: deepMergeObject(defaultTranslationKeys.expressions, translationKeys.expressions)
      }

      axios.post(`${server}/cv-pdf/create/${lang}`, cvData, { responseType: "blob" })
        .then((res) => {
          console.log(lang, "done")
          /* const reader = new FileReader();
          reader.onload = (event) => {
            // localStorage.setItem(cvFile, event.target.result);
            // localStorage.setItem(`CV_DOWNLOAD_${currentLanguageCode.toUpperCase()}_NAME`, res.headers["x-suggested-filename"]);
            saveAs(event.target.result, res.headers["x-suggested-filename"]);
          }
          reader.readAsDataURL(res.data); */
        })
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return <></>
  }
  return (
    <div className="downloadGen" style={{ position: "fixed", top: 250, "zIndex": 99999 }}>
      <button className={"learn-more buttonCV "} onClick={createAndDownloadPdf}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span id="buttonCV" className="buttonCV-text">CvGen</span>
      </button>
    </div>
  )
}


function deepMergeArray(array1, array2) {
  const merged = [
    ...array1,
    ...array2
  ];
  for (const key of merged.keys()) {
    if (Array.isArray(merged[key])) {
      merged[key] = deepMergeArray(array1[key], array2[key]);
    }
    if (merged[key] !== null) {
      if (typeof merged[key] === 'object') {
        merged[key] = deepMergeObject(array1[key], array2[key]);
      }
    }
  }
  return merged.filter(element => {
    if (Object.keys(element).length !== 0) {
      return true;
    }
    return false;
  });
}

function deepMergeObject(obj1, obj2) {
  const merged = {
    ...obj1,
    ...obj2
  };
  for (const key of Object.keys(merged)) {
    if (merged[key] !== null) {
      if (typeof merged[key] === 'object') {
        merged[key] = deepMergeObject(obj1[key], obj2[key]);
      }
      if (Array.isArray(merged[key])) {
        merged[key] = deepMergeArray(obj1[key], obj2[key]);
      }
    }
  }
  return merged;
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var _ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    _ia[i] = byteString.charCodeAt(i);
  }

  var dataView = new DataView(arrayBuffer);
  var blob = new Blob([dataView], { type: mimeString });
  return blob;
}

