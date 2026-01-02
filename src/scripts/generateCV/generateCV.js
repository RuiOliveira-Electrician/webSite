import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import deepMerge from '../../utils/deepMerge.js';
import { pdfTemplate, headerTemplate, footerTemplate } from './documents/newCv/index.js';
import { defaultLanguage, supportedTranledLngs } from '../../i18n/langs.js';
import { links } from '../../resource/links.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTranslations = (locale) => {
  if (!supportedTranledLngs.includes(locale)) {
    throw new Error(`Locale "${locale}" not supported`);
  }

  const localeFilePath = path.join(__dirname, `../../assets/translations/${locale}.json`);
  const defaultLocaleFilePath = path.join(__dirname, `../../assets/translations/${defaultLanguage}.json`);

  const localeJson = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'));
  const defaultLocaleJson = locale === defaultLanguage ? {} : JSON.parse(fs.readFileSync(defaultLocaleFilePath, 'utf8'));

  return { messages: deepMerge(defaultLocaleJson, localeJson) };
};

const generateHTML = async (lang, translationKeys, outputDirectory) => {
  const cvHtml = headerTemplate({ currentLanguageCode: lang, cvData: translationKeys, links: links, cvType: 'cv1' }) +
    pdfTemplate({ currentLanguageCode: lang, cvData: translationKeys, links: links, cvType: 'cv1' }) +
    footerTemplate({ currentLanguageCode: lang, cvData: translationKeys, links: links, cvType: 'cv1' });
  const htmlFilePath = path.join(outputDirectory, `RuiOliveira_CV-${lang.toUpperCase()}.html`);

  // Save the HTML file
  fs.writeFileSync(htmlFilePath, cvHtml, 'utf8');
  console.log(`HTML file generated for ${lang}`);
};

const generatePDF = async (browser, lang, translationKeys, outputDirectory) => {
  const cvHtml = pdfTemplate({ currentLanguageCode: lang, cvData: translationKeys, links: links, cvType: "cv1" });

  const options = {
    format: 'Letter',
    zoomFactor: "1",
    orientation: 'portrait',
    margin: {
      top: '8mm',
      bottom: '8mm',
      left: '8mm',
      right: '8mm',
    },
    displayHeaderFooter: true,
    footerTemplate: footerTemplate({ currentLanguageCode: lang, cvData: translationKeys, links: links, cvType: "cv1" }),
    headerTemplate: headerTemplate({ currentLanguageCode: lang, cvData: translationKeys, links: links, cvType: "cv1" }),
    printBackground: true,
  };

  const page = await browser.newPage();
  await page.setContent(cvHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ ...options, path: path.join(outputDirectory, `RuiOliveira_CV-${lang.toUpperCase()}.pdf`) });
  console.log(`PDF generated for ${lang}`);
  await page.close();
};

const generateCV = async () => {
  const outputDirectory = process.env.OUTPUT_DIR || "public/resource";
  const outputDirectoryTemp = process.env.OUTPUT_DIR || ".temp";

  fs.mkdirSync(outputDirectory, { recursive: true });

  const browser = await puppeteer.launch();
  const supportedTranledLngsKeys = Object.fromEntries(supportedTranledLngs.map(lang => {
    try {
      return [lang, getTranslations(lang).messages];
    } catch (err) {
      console.error(err.message);
      return [lang, null];
    }
  }));

  try {
    await Promise.all(supportedTranledLngs.map(async (lang) => {
      const translationKeys = supportedTranledLngsKeys[lang];
      if (translationKeys) {
        await generateHTML(lang, translationKeys, outputDirectoryTemp);
        await generatePDF(browser, lang, translationKeys, outputDirectory);
      }
    }));
  } catch (err) {
    console.error('Error generating CVs:', err);
  } finally {
    await browser.close();
  }
};

// Start the CV generation process
generateCV().catch(console.error);
