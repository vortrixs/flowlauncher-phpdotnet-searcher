import type { Definition } from './loadPhpDefinitions';

const BASE_URL = 'https://www.php.net';

export default (item: Definition|string): string => {
    if (typeof item === 'string') {
        return `${BASE_URL}/search.php?q=${item}`;
    }

    // build urls for each type/tag of definition

    return BASE_URL;
}