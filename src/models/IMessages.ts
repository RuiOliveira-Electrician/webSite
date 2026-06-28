
export interface ICertification {
    title: string;
    downloadTitle: string;
    companyTitle: string;
    company: string;
    location: string;
    website: string;
    expirationDate: string;
    startDate: string;
    endDate: string;
    type: string[];
}

export interface IProject {
    title: string;
    description: string;
    website: string;
    startDate: string;
    endDate: string;
    type: string[];
}

export interface IOther {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface IProgrammingLanguage {
    title: string;
    img: string;
    website: string;
    type: string[];
}

export interface ILanguage {
    flag: string;
    listening: string;
    reading: string;
    spokenInteraction: string;
    spokenProduction: string;
    writing: string;
}

export interface IExperience {
    title: string;
    functionsPerformed: string[];
    company: string;
    location: string;
    website: string;
    offerType: string;
    startDate: string;
    endDate: string;
    type: string[];
}

export interface IEducation {
    title: string;
    companyTitle: string;
    company: string;
    location: string;
    website: string;
    expirationDate: string;
    startDate: string;
    endDate: string;
    type: string[];
}

