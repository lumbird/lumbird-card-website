export interface TemplateConfig {
  firstNames: string[];
  lastName: string;
  title: string;
  bio: BioConfig;
  contact: ContactDetailsConfig;
  skills: SkillsConfig;
  workHistory: WorkHistoryConfig;
  educationCertificates: EducationCertificateConfig;
  certificates: CertificateConfig;
}

export interface BioConfig {
  [key: string]: BioElement;
}

export interface ContactDetailsConfig {
  [key: string]: ContactDetailElement;
}

export interface SkillsConfig {
  [key: string]: SkillElement;
}

export interface WorkHistoryConfig {
  [key: string]: HistoryElement;
}

export interface EducationCertificateConfig {
  [key: string]: CertificateElement;
}

export interface CertificateConfig {
  [key: string]: CertificateElement;
}

export interface BioElement extends ValueElement, ValuesElement {}
export interface ContactDetailElement extends ValueElement, TypeElement {}
export interface SkillElement extends ValuesElement {}


export interface NamedElement {
  name: string;
}

export interface ValueElement extends NamedElement {
  value: string;
}

export interface TypeElement extends NamedElement {
  type: string;
}

export interface ValuesElement extends NamedElement {
  values: string[];
}

export interface HistoryElement extends ValuesElement {
  company: string;
  startedYear: number;
  endedYear: number;
}

interface CertificateElement extends ValueElement {
  issuedBy: string;
}