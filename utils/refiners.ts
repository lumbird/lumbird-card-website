import * as cheerio from "cheerio";
import fs from 'fs';


function cleanUpTemplate($: cheerio.CheerioAPI, extractedElements: Set<string>): void {

  // Clean up any remaining templates inside the template file itself
  $('[data-template]').each((index: number, nestedElement: cheerio.Element) => {
    const nestedTemplateName = $(nestedElement).data('template') as string;
    if(nestedElement || $(nestedElement).is('html') || $(nestedElement).is('body')) {
      $(nestedElement).remove();
    }
  });

  // Move all the body content too the root, this is because of a stinking bug which makes
  // all the elements inside a html document, which we don't want
  $('body').children().each((index: number, childElement: cheerio.Element) => {
    $.root().append(childElement);
  });
  
  // Remove these unused elements
  $('html').remove();
  $('body').remove();
}

export function extractTemplates(inputExtraction: string, outputExtraction: string): void {
  // Read the index.html file
  const indexHtml = fs.readFileSync(inputExtraction, 'utf8');

  // Load the HTML content using Cheerio
  const $ = cheerio.load(indexHtml);

  // Extracted elements
  const extractedElements: Set<string> = new Set();

  // Find and extract templates based on comments
  $('[data-template]').each((index: number, element: cheerio.Element) => {
    const templateName = $(element).data('template') as string;
    const templateContent = $(element).html();

    if (templateName && templateContent) {
      // Remove the template element from the HTML content
      $(element).remove();
      extractedElements.add(templateName);

      // Recursively remove nested templates from the extracted template
      const templateElement = cheerio.load(templateContent);
      cleanUpTemplate(templateElement, extractedElements);

      // Write the template content to a separate file
      fs.writeFileSync(`templates/${templateName}.html`, templateElement.html());
    }
  });

  // Write the modified index.html to build directory
  fs.writeFileSync(outputExtraction, $.html());
}

export function createTemplate(file: string): string {
    // Read the index.html file
   return fs.readFileSync('templates/'+file, 'utf8');
}