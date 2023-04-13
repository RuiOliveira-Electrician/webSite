const fs = require("fs");
const path = require("path");

module.exports = ({ currentLanguageCode, app_title, title, profile, characteristics, skills, languagesKey, languages, programmingLanguages, educations, experiences, projects, others, expressions }) => {
  const template = path.resolve(__dirname, "./cvTemplate.html")


  function getIntervalDate(arg) {
    return `${arg.startDateYear === "" ? "" : arg.startDateDay
      + " " + (arg.startDateMonth === "" ? "" : expressions.month[arg.startDateMonth]) + " " + arg.startDateYear + " - "
      }

    ${arg.endDateYear === "" ? "" :
        arg.endDateYear === "Present" ? expressions.month.Present :
          arg.endDateDay + " " + (arg.endDateMonth === "" ? "" : expressions.month[arg.endDateMonth]) + " " + arg.endDateYear
      }`;
  }

  const profileHtml = (`${profile}`);

  const contactInfoHtml = (`<div class="contact-info">
  <h3 class="contactInfo">${characteristics.sex} |  ${characteristics.dateOfBirth} | ${characteristics.nationality}</h3>
  <h3 class="contactInfo">2960 Brecht, Belgium</h3>
  <div class="lineBrake"> </div>
  <h3 class="contactInfo"><a href="https://www.rui-oliveira.com/${currentLanguageCode}">www.rui-oliveira.com</a></h3>
  <h3 class="contactInfo"><a href="mailto:hire@rui-oliveira.com">hire@rui-oliveira.com</a></h3>
  <h3 class="contactInfo">+32474127175</h3>
</div>`);

  const numRows = Math.ceil(skills.length / 2);
  const skillsHtml = (`
  <table>
    <tbody>
      ${Array.from({ length: numRows }, (_, rowIndex) => {
    const dataIndex = rowIndex * 2;
    const rowHtml = `
          <tr>
            <td class="skill">
              <h2>${skills[dataIndex].title}</h2>
              <p class="spaceBrake">${skills[dataIndex].description}</p>
              </div>
            </td>
            ${dataIndex + 1 < skills.length ? `
          <td class="skill">
            <h2>${skills[dataIndex + 1].title}</h2>
            <p class="spaceBrake">${skills[dataIndex + 1].description}</p>
          </td>`
        : '<td></td>'
      }
          </tr>
        `;
    return rowHtml;
  }).join('')}
    </tbody>
  </table>
  `);

  const experienceHtml = experiences?.map((experience, i) => `
      <div class="job${i === experiences.length - 1 ? ' last' : ''}">
        <a class="experience link noBrake" target="_blank" rel="noreferrer" href={${experience.website}}><h2 class="noBrake">${experience.company}</h2> <h3 class="noBrake"> in ${experience.location}</h3></a >
        <h4 class="experience">${experience.title}</h4>
        <h4 class="first intervalDate">${getIntervalDate(experience)}</h4>
        <h4 class="second intervalDate">${expressions.offerType[experience.offerType]}</h4>
        <p>${experience.functionsPerformed}</p>
      </div > `);


  const educationHtml = educations?.map((education, i) => `
    <div class="job${i === educations.length - 1 ? ' last' : ''}">
      <h2 class="experience">${education.title}</h2>
      <a class="experience link noBrake" target="_blank" rel="noreferrer" href={${education.website}}><h3 class="noBrake">${education.company}</h3> <h4 class="noBrake"> in ${education.location}</h4></a >
      <h4 class="first intervalDate">${getIntervalDate(education)}</h4>
    </div>`);


  const projectHtml = projects?.map((project, i) => `
      <div class="job${i === projects.length - 1 ? ' last' : ''}">
       <a class="experience link" target="_blank" rel="noreferrer" href={${project.website}}><h2>${project.title}</h2></a>
       <h4 class="first intervalDate">${getIntervalDate(project)}</h4>
       <p>${project.description}</p>
     </div > `);

  const otherHtml = others?.map((other, i) => `
    <div class="job${i === others.length - 1 ? ' last' : ''}">
     <h2>${other.title}</h2>
      <h4 class="first intervalDate">${getIntervalDate(other)}</h4>
      <p>${other.description}</p>
     </div > `);


  const languageHtml = (`
     <table>
          <thead>
            <tr>
              <th>${languagesKey.language}</th>
              <th colSpan="2">${languagesKey.understanding}</th>
              <th colSpan="2">${languagesKey.speaking}</th>
              <th >${languagesKey.writing}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>${languagesKey.listening}</td>
              <td>${languagesKey.reading}</td>
              <td>${languagesKey.interaction}</td>
              <td>${languagesKey.production}</td>
              <td></td>
            </tr>
            ${languages?.map((language) => `
              <tr>
                <td class="left">${language.language}</td>
                <td>${language.listening}</td>
                <td>${language.reading}</td>
                <td>${language.spokenInteraction}</td>
                <td>${language.spokenProduction}</td>
                <td>${language.writing}</td>
              </tr>
            `).join("\n")}
            <tr>
              <td class="lineBrake langDescription" colSpan="5">
                <p>${languagesKey.levels}</p>
                <p>${languagesKey.framework}</p>
              </td>
            </tr>
          </tbody>
        </table>`);


  /*      <td className="noBorder left"><span className={"flag-icon flag-icon-" + t(languages.description.${i}.flag)}></span>{degree.language}</td>
    */

  return fs.readFileSync(template).toString()
    .replace("{{app_title}}", app_title)
    .replace("{{contactInfo}}", contactInfoHtml)
    .replace("{{title}}", title)
    .replace("{{profile}}", profileHtml)
    .replace("{{skills}}", skillsHtml)
    .replace("{{educations}}", educationHtml?.join("\n"))
    .replace("{{experiences}}", experienceHtml?.join("\n"))
    .replace("{{projects}}", projectHtml?.join("\n"))
    .replace("{{others}}", otherHtml?.join("\n"))
    .replace("{{languages}}", languageHtml);
};
// babel