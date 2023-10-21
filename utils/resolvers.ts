import fs from 'fs';

export function loadAndInject(filePath: string, tokens: {[key: string]: string}) {  
    // Read the index.html file
    let indexHtml = fs.readFileSync(filePath, 'utf8');

    // Replace tokens with data
    Object.keys(tokens).forEach(token => {
      const formattedToken = '{{'+token+'}}';
      indexHtml = indexHtml.replace(new RegExp(formattedToken, 'g'), tokens[token]);
    });

    return indexHtml;
}

export function iconResolver(type: string): string {
  switch (type) {
    case 'phone':
      return 'fa fa-user';
    case 'linkedIn':
      return 'fab fa-brands fa-linkedin';
    case 'email':
      return 'fa fa-at';
    case 'address':
      return 'fa fa-map-pin';
    default:
      return 'fa';
  }
}