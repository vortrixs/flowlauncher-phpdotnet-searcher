import { Flow, type JSONRPCResponse } from 'flow-launcher-helper'
import Cache from 'file-system-cache'
import loadDefinitions from './loadPhpDefinitions';
import Fuse from 'fuse.js'
import buildUrl from './buildUrl';

const cache = Cache({
    basePath: "./.cache",
    ttl: 60*60*24*14, // 14 days in seconds
});

const definitions = await loadDefinitions(cache);
const fuzzysearch = new Fuse(definitions, {
    keys: ['name', 'description', 'methodName']
});

type Methods = 'open_result';

const { on, run, showResult } = new Flow<Methods>('php.png');

on('query', (params) => {
    if (params.length <= 1) {
        return showResult({ title: 'Waiting for query...' });
    }

    const data = fuzzysearch.search(params[0].toString());

    if (0 === data.length) {
        showResult({
            title: 'No match found',
            subtitle: `Search on php.net for ${params}`,
            method: 'open_result',
            params: [buildUrl(params[0].toString())],
            iconPath: 'php.png',
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
        score,
      });
    });

    showResult(...results);
});

on('open_result', (params) => {
  const url = params[0];
  open(url.toString());
});

run();