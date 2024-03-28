import { TemplateConfig } from "./utils/config.interfaces";
import { extractTemplates } from "./utils/refiners";
import { iconResolver, loadAndInject } from "./utils/resolvers";
import { toUpperCase } from "./utils/strings";
import fs from 'fs';
import yaml from 'js-yaml';

export function build() {
  // Load config
  const config = yaml.load(fs.readFileSync('./src/config.yaml', 'utf8')) as {[key: string]: TemplateConfig};
  const template = config.default;

  // Root template file paths
  const sourceRootTemplate = 'src/index.html';
  const buildRootTemplate = 'www/index.html';

  // Ensure that the folder exists
  if (!fs.existsSync('www')) {
    fs.mkdirSync('www');
  }

  // Extract Templates and remove the templates from the extraction
  extractTemplates(sourceRootTemplate, buildRootTemplate);

  // Write output page
  fs.writeFileSync(buildRootTemplate, loadAndInject('www/index.html', {}));
}