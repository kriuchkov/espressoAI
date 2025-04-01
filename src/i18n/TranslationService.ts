import { translations } from "./translations";

export class TranslationService {
  private languageCode: string;

  constructor(languageCode: string) {
    this.languageCode = languageCode;
  }

  translate(key: string, params: Record<string, string | number> = {}): string {
    const lang = this.languageCode in translations ? this.languageCode : "en";
    let text = translations[lang][key] || translations["en"][key] || key;
    
    // Replace parameters
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
    
    return text;
  }
}
