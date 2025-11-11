import type { Cache } from 'node-file-cache';
import fetch from 'node-fetch';

/**
 * @see https://www.php.net/js/search.js
 * @see https://www.php.net/js/search-index.php?lang=en
 * 
 * Examples:
 * "copyright":["Copyright","PHP Manual","legalnotice"]
 * "function.array-find":["array_find","Returns the first element satisfying a callback function","refentry"]
 * "class.datetimeimmutable":["DateTimeImmutable","The DateTimeImmutable class","phpdoc:classref"]
 */

export type Definition = { id: string, name: string, description: string, tag: string, type: string, methodName: string };

const loadDefinitions = async (cache: Cache, language: string): Promise<Definition[]> => {
    const cachedDefinitions: Definition[] = cache.get(language);

    if (cachedDefinitions) {
        return cachedDefinitions;
    }

    const response = await fetch(`https://www.php.net/js/search-index.php?lang=${language}`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const definitions = await response.json() as Definition[];
        
    cache.set(language, definitions);

    return definitions;
}

export default loadDefinitions;
