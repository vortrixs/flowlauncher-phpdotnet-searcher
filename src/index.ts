import { Flow, type JSONRPCResponse } from 'flow-launcher-helper'
import loadDefinitions from './loadPhpDefinitions.js';
import Fuse from 'fuse.js'
import buildUrl from './buildUrl.js';
import { create as createCache} from 'node-file-cache';
import path from 'node:path';
import { cwd } from 'process'
import calculateScore from './calculateScore.js';
import open from 'open';

// TODO - try replacing flow-launcher-helper with https://github.com/DrafaKiller/FlowPlugin-ts

type Methods = 'open_result';

const { on, run, showResult } = new Flow<Methods>('php.png');
const cache = createCache({ file: path.resolve(cwd(), '.cache/cache.db'), life: 60*60*24*14 });

const init = async () => {
  const definitions = await loadDefinitions(cache);
  const fuzzysearch = new Fuse(definitions, {
      keys: ['name', 'description', 'methodName'],
      includeScore: true,
  });

  on('query', (params) => {
      if (params.length < 1) {
          return showResult({ title: 'Waiting for query...' });
      }

      const searchQuery = params[0].toString();

      const data = fuzzysearch.search(searchQuery, { limit: 10 });

      if (0 === data.length) {
          showResult({
              title: 'Search on php.net for ${searchQuery}',
              method: 'open_result',
              params: [buildUrl(searchQuery)],
              iconPath: 'php.png',
              score: 100,
          });
      }

      const results: JSONRPCResponse<Methods>[] = [];

      data.forEach(({ item, score }) => {
        results.push({
          title: item.name,
          subtitle: `${item.type} • ${item.description}`,
          method: 'open_result',
          params: [buildUrl(item)],
          iconPath: 'php.png',
          score: calculateScore(score ?? 0),
        });
      });

      showResult(...results);
  });

  on('open_result', (params) => open(params[0].toString()));
}

try {
  init().then(() => run());  
} catch (error) {
  console.log(error);
  throw new Error(`Error: ${error}`);
}
