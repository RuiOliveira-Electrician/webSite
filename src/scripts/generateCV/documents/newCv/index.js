import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getFormatDate } from "../../../../utils/getFormatDate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssIconsTemplate = path.resolve(__dirname, "../../../../assets/icons/css/fontello-embedded.css");
console.log(cssIconsTemplate)
const cssTemplate = path.resolve(__dirname, "./cvCss.css");

export const pdfTemplate = ({ currentLanguageCode, cvData, links, cvType }) => {
  const template = path.resolve(__dirname, "./cvTemplate.html");

  const app_title = cvData.meta.app_title;
  const title = cvData.home.subTitle.first;
  const profile = cvData.about.description.cv;
  const languages = cvData.languages.description;
  const languagesKey = cvData.languages.key;
  const name = cvData.characteristics.name;
  const characteristics = cvData.characteristics;
  const softSkills = cvData.skills.softSkills.description;
  const educations = cvData.educations.description;
  const certifications = cvData.certifications.description;
  const experiences = cvData.experiences.description;
  const programmingLanguages = cvData.programmingLanguages.description;
  const projects = cvData.projects.description;
  const expressions = cvData.expressions;

  const profileHtml = (`${profile}`);

  const skillsHtml = `
    <div class="yui-gf pageBrake">
      <div class="line-with-text"><h2 class="icon-flow-tree">&nbsp;&nbsp;${cvData.skills.softSkills.underlayTitle}</h2></div>
      ${softSkills?.map((skill, i) => skill.type.includes(cvType) ? `
        <div class="skills${i === 0 ? ' firstCv' : ''}">
          <h4 class="icon-plus blue-icon">&nbsp;&nbsp;${skill.title}</h4>
        </div>
      `: '').join('')}
    </div>
  `;

  const experienceHtml = `
  <div class="yui-gf pageBrake">
    <div class="line-with-text"><h2 class="icon-briefcase">&nbsp;&nbsp;${cvData.experiences.underlayTitle}</h2></div>
    ${cvData.experiences.description?.map((experience, i) => experience.type.includes(cvType) ? `
      <div class="experiences${i === 0 ? ' firstCv' : ''}">
        <h3 class="experience title">${experience.title}</h3>
        <a class="experience link noBrake" target="_blank" rel="noreferrer" href="${experience.website}">   
          <h4 class="noBrake company">${experience.company}</h4>
          <h4 class="noBrake company">${expressions.prepositions.in} ${experience.location}</h4>
        </a>
        <h4 class="first-intervalDate intervalDate date">${getFormatDate(experience, expressions)}</h4>
        <h4 class="second-intervalDate intervalDate date">${expressions.offerTypes[experience.offerType]}</h4>
        ${experience.type.includes(cvType + "-bulletPoints") ?
      (typeof experience.functionsPerformed === 'object' ?
        Object.values(experience.functionsPerformed).map((functionPerformed) => `
              <p class="description icon-right-open blue-icon">${functionPerformed}</p>
            `).join('')
        : ' '
      ) : ''}
      </div>
    ` : '').join('')}
  </div>
`;

  const educationHtml = `
    <div class="yui-gf pageBrake">
      <div class="line-with-text"><h2 class="icon-graduation-cap">&nbsp;&nbsp;${cvData.educations.underlayTitle}</h2></div>
      ${educations?.map((education, i) => education.type.includes(cvType) ? `
        <div class="educations${i === 0 ? ' firstCv' : ''}">
          <h4 class="experience">${education.title}</h4>
          <a class="experience link noBrake" target="_blank" rel="noreferrer" href="${education.website}">
            <h5 class="noBrake company">${education.company}</h5> <h5 class="noBrake company"> ${expressions.prepositions.in} ${education.location}</h5>
          </a>
        </div>`: '').join('')}
    </div>
  `;

  const certificationHtml = `
  <div class="yui-gf pageBrake">
    <div class="line-with-text"><h2 class="icon-certificate-outline">&nbsp;&nbsp;${cvData.certifications.underlayTitle}</h2></div>
    ${certifications?.map((certification, i) => certification.type.includes(cvType) ? `
      <div class="certifications${i === 0 ? ' firstCv' : ''}">
        <h4 class="experience">${certification.title}</h4>
        <a class="experience link noBrake" target="_blank" rel="noreferrer" href="${certification.website}">
          <h5 class="noBrake company">${certification.company}</h5> <h5 class="noBrake company"> ${expressions.prepositions.in} ${certification.location}</h5>
        </a>
      </div>`: '').join('')}
  </div>
`;


  const programmingLanguageHtml = `
<div class="yui-gf pageBrake">
  <div class="line-with-text">
    <h2 class="icon-laptop">&nbsp;&nbsp;${cvData.programmingLanguages.underlayTitle}</h2>
  </div> <div class="programmingLanguages">
  ${programmingLanguages?.map((programmingLanguage, i) => programmingLanguage.type.includes(cvType) ? `
    <a href="${programmingLanguage.website}" target="_blank" class="svg-link${i === 0 ? ' first' : ''}">
      <div class="svg-container">
        ${fs.readFileSync(path.resolve(__dirname, `../../../../assets/images/programming_languages/${programmingLanguage.img}.svg`), 'utf8')}  
      </div>     
    </a>   
    ` : '').join('')} 
  </div>
</div>
`;

  const projectHtml = `
<div class="yui-gf pageBrake">
  <div class="line-with-text">
    <h2 class="icon-search">&nbsp;&nbsp;${cvData.projects.underlayTitle}</h2>
  </div>
  ${projects?.map((project, i) => {
    if (!project.type.includes(cvType)) return '';

    const rawLink = project.website
      ? project.website
      : project.gitRepository
        ? links.github.link + project.gitRepository
        : '#';

    const projectLink =
      rawLink !== '#' && !rawLink.endsWith('/') ? rawLink + '/' : rawLink;

    return `
      <div class="projects${i === 0 ? ' firstCv' : ''}">
        <a class="experience link" target="_blank" rel="noreferrer" href="${projectLink}">
          <h3 class="experience title">${project.title}</h3>
        </a>
        <h4 class="first-intervalDate intervalDate date">${getFormatDate(project, expressions)}</h4>
        <p class="description">${project.description}</p>
      </div>
    `;
  }).join('')}
</div>
`;


  const proficiencyMap = {
    A1: '20%',
    A2: '30%',
    B1: '50%',
    B2: '70%',
    C1: '90%',
    C2: '100%'
  };

  const languageHtml = `
    <div class="yui-gf pageBrake ">
      <div class="line-with-text"><h2 class="icon-globe">&nbsp;&nbsp;${cvData.languages.underlayTitle}</h2></div>
      ${languages?.map((language, i) => `
        <div class="language-level">
          <div class="language">
            <h4 class="centre">${expressions.languages[language.flag]} - ${expressions.languagesLevels[language.level]} </h4>
            <div class="bar-container">
              <div class="bar" style="width: ${proficiencyMap[language.listening] || '0%'};"></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  return fs.readFileSync(template).toString()
    .replace("{{cssIcons}}", "<style>" + fs.readFileSync(cssIconsTemplate).toString() + "</style>")
    .replace("{{css}}", "<style>" + fs.readFileSync(cssTemplate).toString() + "</style>")
    .replace("{{app_name}}", name)
    .replace("{{name}}", name)
    .replace("{{app_title}}", app_title)
    .replace("{{title}}", title)
    .replace("{{profile}}", profileHtml)
    .replace("{{skills}}", skillsHtml)
    .replace("{{educations}}", educationHtml)
    .replace("{{certifications}}", certificationHtml)
    .replace("{{programmingLanguages}}", programmingLanguageHtml)
    .replace("{{experiences}}", experienceHtml)
    .replace("{{projects}}", projectHtml)
    .replace("{{languages}}", languageHtml);
};

export const headerTemplate = ({ currentLanguageCode, cvData, links, cvType }) => {
  return '<header></header>';
};

export const footerTemplate = ({ currentLanguageCode, cvData, links, cvType }) => {
  return `
    <style>${fs.readFileSync(cssIconsTemplate).toString()}</style>
    <style>${fs.readFileSync(cssTemplate).toString()}</style>
    <div class="contact-info yui-gf">
      <h3 class="contactInfo noBrake blue-icon icon-globe-1">
        <a href="${links.website.link}${currentLanguageCode}">&nbsp;&nbsp;${links.website.showName}</a>
      </h3>
      <h3 class="contactInfo noBrake blue-icon icon-mail">
        <a href="${links.mail.link}">&nbsp;&nbsp;${links.mail.showName}</a>
      </h3>
      <h3 class="contactInfo noBrake blue-icon icon-phone">&nbsp;&nbsp;${links.gsm.link}</h3>
      <h3 class="contactInfo noBrake blue-icon icon-home">&nbsp;&nbsp;${cvData.expressions.places.antwerp}, ${cvData.expressions.countries.BE}</h3>
    </div>`;
};
