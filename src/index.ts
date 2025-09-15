import loadDefinitions from './loadPhpDefinitions.js';
import Fuse from 'fuse.js'
import buildUrl from './buildUrl.js';
import { create as createCache} from 'node-file-cache';
import path from 'node:path';
import { cwd } from 'process'
import calculateScore from './calculateScore.js';
import { type AvailableResult, Flow } from 'flow-plugin';
import Settings from './Settings.js';

const flow = new Flow({ autoRun: false, keepOrder: true, icon: 'php.png' });
const settings = new Settings(flow);

const cache = createCache({ file: path.resolve(cwd(), '.cache/cache.db'), life: 60*60*24*14 });
const definitions = await loadDefinitions(cache, settings.getLanguage());
const fuzzysearch = new Fuse(definitions, { keys: ['name', 'methodName', 'description'], includeScore: true });

flow.on('query', ({ prompt }, response) => {
    if (prompt.trim().length === 0) {
        return response.add({
            title: 'Type to search PHP documentation',
            subtitle: 'You can search by function name, class name, method name, or any keyword',
            icoPath: 'php.png',
            score: 100,
        });
    }

    const data = fuzzysearch.search(prompt.trim(), { limit: 10 });

    if (data.length === 0) {
        return response.add({
            title: `Search on php.net for ${prompt}`,
            subtitle: 'No results found, click to search on php.net',
            jsonRPCAction: Flow.Actions.openUrl(buildUrl(prompt.trim(), settings.getLanguage())),
            icoPath: 'php.png',
            score: 100,
        });
    }

    const results: AvailableResult[] = [];

    data.forEach(({ item, score }) => {
      results.push({
        title: item.name,
        subtitle: `${item.type} • ${item.description}`,
        jsonRPCAction: Flow.Actions.openUrl(buildUrl(item, settings.getLanguage())),
        icoPath: 'php.png',
        score: calculateScore(score ?? 0),
      });
    });

    return response.add(...results);
});

flow.run();