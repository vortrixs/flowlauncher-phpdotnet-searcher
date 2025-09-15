import loadDefinitions from './loadPhpDefinitions.js';
import Fuse from 'fuse.js'
import buildUrl from './buildUrl.js';
import { create as createCache} from 'node-file-cache';
import path from 'node:path';
import { cwd } from 'process'
import calculateScore from './calculateScore.js';
import { type AvailableResult, Flow } from 'flow-plugin';
import { getLanguageCode, Settings } from './settings.js';

const flow = new Flow({ autoRun: false, keepOrder: true, icon: 'php.png' });

const settings = flow.read().settings as Record<'lang', Settings['lang']>;

const cache = createCache({ file: path.resolve(cwd(), '.cache/cache.db'), life: 60*60*24*14 });
const definitions = await loadDefinitions(cache, getLanguageCode(settings));
const fuzzysearch = new Fuse(definitions, {keys: ['name', 'description', 'methodName'],includeScore: true});

flow.on('query', ({ prompt }, response) => {
    const data = fuzzysearch.search(prompt, { limit: 10 });

    if (0 === data.length) {
        response.add({
            title: `Search on php.net for ${prompt}`,
            subtitle: 'No results found, click to search on php.net',
            jsonRPCAction: Flow.Actions.openUrl(buildUrl(prompt)),
            icoPath: 'php.png',
            score: 100,
        });
    }

    const results: AvailableResult[] = [];

    data.forEach(({ item, score }) => {
      results.push({
        title: item.name,
        subtitle: `${item.type} • ${item.description}`,
        jsonRPCAction: Flow.Actions.openUrl(buildUrl(item)),
        icoPath: 'php.png',
        score: calculateScore(score ?? 0),
      });
    });

    response.add(...results);
});

flow.run();