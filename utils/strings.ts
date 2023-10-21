export function toNormalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}
  
export function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export function toUpperCase(str: string): string {
    return str.toUpperCase();
}

export function toLowerCase(str: string): string {
    return str.toLowerCase();
}