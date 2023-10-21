export interface RedirectConfig {
  [key: string]: string;
}

export interface TemplateConfig {
  redirects: RedirectConfig;
}