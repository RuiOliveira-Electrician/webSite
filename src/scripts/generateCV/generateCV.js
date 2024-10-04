const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const deepMerge = require('../../util/deepMerge.js'); // Assuming you have a deepMerge function
const pdfTemplate = require('./documents/index.js'); // Import the CV generation function
const { defaultLanguage, supportedLngs } = require('../../resource/lngs/langs.js');


const getTranslations = (locale) => {
  if (!supportedLngs.includes(locale)) {
    throw new Error(`Locale "${locale}" not supported`);
  }

  const localeFilePath = path.join(__dirname, `../../messages/${locale}.json`);
  const defaultLocaleFilePath = path.join(__dirname, `../../messages/${defaultLanguage}.json`);

  const localeJson = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'));
  const defaultLocaleJson = locale === defaultLanguage ? {} : JSON.parse(fs.readFileSync(defaultLocaleFilePath, 'utf8'));

  return { messages: deepMerge(defaultLocaleJson, localeJson) };
};

const generatePDF = async (browser, lang, translationKeys, outputDirectory) => {
  const cvHtml = pdfTemplate({ currentLanguageCode: lang, cvData: translationKeys });
  const options = {
    format: 'Letter',
    zoomFactor: "1",
    orientation: 'portrait',
    displayHeaderFooter: true, // Enable header and footer display
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '10mm',
      right: '10mm',
    },
    footerTemplate: `<div style="font-size: 10px; text-align: center; width: 100%;">
      <p>Rui Oliveira &mdash; <a href="https://www.rui-oliveira.com/${lang}">www.rui-oliveira.com</a> &mdash; +32474127175</p>
      <div>${translationKeys.expressions.page} <span class="pageNumber"></span> of <span class="totalPages"></span></div>
    </div>`,
    headerTemplate: '<header></header>', // If you want a custom header, you can define it here
    printBackground: true, // Ensure background colors/images are printed
  };

  const page = await browser.newPage();
  await page.setContent(cvHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ ...options, path: path.join(outputDirectory, `RuiOliveira_CV-${lang.toUpperCase()}.pdf`) });
  console.log(`CV generated for ${lang}`);
  await page.close();
};

const generateCV = async () => {
  const outputDirectory = process.env.OUTPUT_DIR || "public/resource";
  fs.mkdirSync(outputDirectory, { recursive: true });

  const browser = await puppeteer.launch();
  const supportedLngsKeys = Object.fromEntries(supportedLngs.map(lang => {
    try {
      return [lang, getTranslations(lang).messages];
    } catch (err) {
      console.error(err.message);
      return [lang, null]; // Return null for failed translations
    }
  }));

  try {
    await Promise.all(supportedLngs.map(lang => {
      const translationKeys = supportedLngsKeys[lang];
      if (translationKeys) return generatePDF(browser, lang, translationKeys, outputDirectory);
    }));
  } catch (err) {
    console.error('Error generating CVs:', err);
  } finally {
    await browser.close();
  }
};

// Start the CV generation process
generateCV().catch(console.error);