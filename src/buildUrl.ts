import type { Definition } from './loadPhpDefinitions.js';

const BASE_URL = 'https://www.php.net';

export default (item: Definition|string, language: string = 'en'): string => {
    if (typeof item === 'string') {
        return `${BASE_URL}/search.php?q=${encodeURIComponent(item)}`;
    }

    return `${BASE_URL}/manual/${encodeURIComponent(language)}/${encodeURIComponent(item.id)}.php`;
}