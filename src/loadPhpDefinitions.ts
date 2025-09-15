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
type PhpDefinitionList = {[id:string]: string[]};
export type Definition = { id: string, name: string, description: string, tag: string, type: string, methodName: string|undefined };

const processDefinitions = (index: PhpDefinitionList): Definition[] => Object.entries(index)
    .map(([id, [name, description, tag]]) => {
        if (!name) return null;

        let type = "General";
        
        switch (tag) {
            case "phpdoc:varentry":
                type = "Variable";
                break;

            case "refentry":
                type = "Function";
                break;

            case "phpdoc:exceptionref":
                type = "Exception";
                break;

            case "phpdoc:classref":
                type = "Class";
                break;

            case "set":
            case "book":
            case "reference":
                type = "Extension";
                break;
        }

        return {
            id,
            name,
            description,
            tag,
            type,
            methodName: name.split("::").pop(),
        };
    })
    .filter((v): v is Definition => Boolean(v));

const loadDefinitions = async (cache: Cache, language: string): Promise<Definition[]> => {
    const cachedDefinitions: Definition[] = cache.get(language);

    if (cachedDefinitions) {
        return cachedDefinitions;
    }

    const response = await fetch(`https://www.php.net/js/search-index.php?lang=${language}`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const definitions = processDefinitions(await response.json() as unknown as PhpDefinitionList);
        
    cache.set(language, definitions);

    return definitions;
}

export default loadDefinitions;
