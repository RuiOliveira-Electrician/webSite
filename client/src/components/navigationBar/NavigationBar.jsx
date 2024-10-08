import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

import "./NavigationBar.scss";
import Language from "../Languages/Language";
import { pageList } from "../../resource/pages"

import getImagesFromFolder from './../../util/getImagesFromFolder';

function CurrentPage(currentLanguageCode) {
  let currentPage = document.location.pathname.split("/");

  if (currentPage.length === 0 || currentPage.length === 1 || currentPage.length === 2) {
    currentPage = '';
  }
  else if (currentPage.length === 3) {
    currentPage = currentPage[currentPage.length - 1];
  }
  return currentPage;
}

export function NavigationBar(props) {
  const images = getImagesFromFolder(props.images, "logo");
  const { t } = useTranslation();
  const currentLanguageCode = props.i18n.language;
  const currentPage = CurrentPage(currentLanguageCode);

  function CssLink(page) {
    let className = 'notThisPage';
    if (currentPage === page.url) {
      className = 'thisPage';
    }
    return className;
  }

  return (
    <nav className="mainNavigationBar">
      <Link className="iconNavigationBar" to={`/${currentLanguageCode}`}>
        <img src={images.logo} className={CssLink(pageList[0])} alt="Logo" />
      </Link>
      <div className="contentNavigationBar">
        {pageList.reduce((urls, page, i) => {
          if (page.navigationBar) {
            urls.push(<Link key={i} className={CssLink(page)} to={`/${currentLanguageCode}${page.url === '' ? '' : '/'}${page.url}`} >{t(`navigationBar.${page.name}`)}</Link>);
          }
          return urls;
        }, [])}
      </div>
      <div className="languageNavigationBar">
        <Language />
      </div>
    </nav>
  )
}

export default NavigationBar;

