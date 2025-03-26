import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { generateGraph } from './src/generate-graph';
import { getSerializableAetherGraph } from './src/get-serializable-aether-graph';

const MAX_DIFFICULTY = 3;

const graph = generateGraph(MAX_DIFFICULTY);
const graphData = getSerializableAetherGraph(graph);

const outFileURL = new URL('src/aether-graph.json', import.meta.url);
const outFile = fileURLToPath(outFileURL);

fs.writeFileSync(outFile, JSON.stringify(graphData, null, 2));
