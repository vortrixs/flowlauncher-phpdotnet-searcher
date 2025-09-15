export interface Settings {
	lang: "English" | "German" | "Spanish" | "French" | "Italian" | "Japanese" | "Brazilian Portuguese" | "Russian" | "Turkish" | "Ukrainian" | "Chinese (Simplified)";
}

const settingsMap: Record<Settings["lang"], string> = {
    "English": "en",
    "German": "de",
    "Spanish": "es",
    "French": "fr",
    "Italian": "it",
    "Japanese": "ja",
    "Brazilian Portuguese": "pt_BR",
    "Russian": "ru",
    "Turkish": "tr",
    "Ukrainian": "uk",
    "Chinese (Simplified)": "zh"
};

export const getLanguageCode = (settings: Settings): string => {
    return settingsMap[settings?.lang] || 'en';
}