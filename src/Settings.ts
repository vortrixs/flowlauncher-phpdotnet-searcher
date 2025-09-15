import type { Flow } from "flow-plugin";

type Language = "English" | "German" | "Spanish" | "French" | "Italian" | "Japanese" | "Brazilian Portuguese" | "Russian" | "Turkish" | "Ukrainian" | "Chinese (Simplified)";
type LanguageCode = "en" | "de" | "es" | "fr" | "it" | "ja" | "pt_BR" | "ru" | "tr" | "uk" | "zh";

interface PluginSettings {
	lang: Language;
}

export default class Settings {
    private settings: PluginSettings|undefined;

    private readonly languageCodeMap = new Map<Language, LanguageCode>(
        [
            ["English", "en"],
            ["German", "de"],
            ["Spanish", "es"],
            ["French", "fr"],
            ["Italian", "it"],
            ["Japanese", "ja"],
            ["Brazilian Portuguese", "pt_BR"],
            ["Russian", "ru"],
            ["Turkish", "tr"],
            ["Ukrainian", "uk"],
            ["Chinese (Simplified)", "zh"],
        ]
    );

    constructor(flow: Flow) {
        this.settings = flow.read().settings as PluginSettings|undefined;
    }

    public getLanguage(): LanguageCode {
        if (!this.settings) return 'en';

        return this.languageCodeMap.get(this.settings.lang) ?? 'en';
    }
}