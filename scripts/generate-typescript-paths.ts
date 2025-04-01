import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type PathMapping = Record<string, Array<string>>;

interface TSConfig {
  compilerOptions: {
    paths: PathMapping;
  };
}

const PROJECTS_DIR = path.join(process.cwd(), 'projects');
const BASE_TSCONFIG_PATH = path.join(process.cwd(), 'tsconfig.base.json');

try {
  await generateTypeScriptPaths();
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to update TypeScript path mappings:', error.message);
  }

  throw error;
}

async function generateTypeScriptPaths(): Promise<void> {
  const entries = await readdir(PROJECTS_DIR, { withFileTypes: true });

  const projects = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  // update base tsconfig.json
  const basePathMappings = generateBasePathMappings(projects);

  await updateTSConfig(BASE_TSCONFIG_PATH, basePathMappings);

  // update project configs
  await Promise.all(
    projects.map(async (project) => {
      const configPath = path.join(PROJECTS_DIR, project, 'tsconfig.json');
      const projectPathMappings = generateProjectPathMappings(
        projects,
        project,
      );

      await updateTSConfig(configPath, projectPathMappings, true);
    }),
  );

  console.log('✨ TypeScript path mappings updated successfully');
}

function generateBasePathMappings(projects: Array<string>): PathMapping {
  return Object.fromEntries(
    projects.map((project) => {
      const [key, value] = createProjectMapping(project, false);

      return [key, [value]];
    }),
  );
}

function generateProjectPathMappings(
  projects: Array<string>,
  currentProject: string,
): PathMapping {
  const mappings: PathMapping = {};

  const libProjects = projects.filter((name) => name.startsWith('lib-'));

  for (const project of libProjects) {
    const [key, value] = createProjectMapping(project, true);

    mappings[key] = [value];
  }

  // we want to map all our other services to our API so we can use their
  // TRPC routers
  if (currentProject === 'service-api') {
    const serviceProjects = projects.filter(
      (name) => name.startsWith('service-') && name !== 'service-api',
    );

    for (const project of serviceProjects) {
      const [key, value] = createProjectMapping(project, true);

      mappings[key] = [value];
    }
  }

  return mappings;
}

async function updateTSConfig(
  configPath: string,
  pathMappings: PathMapping,
  preserveTilde = false,
): Promise<void> {
  const content = await readFile(configPath, 'utf8');

  const config = JSON.parse(content) as TSConfig;
  const existingPaths = config.compilerOptions.paths || {};

  config.compilerOptions.paths = {
    ...(preserveTilde && existingPaths['~/*']
      ? { '~/*': existingPaths['~/*'] }
      : {}),
    ...pathMappings,
  };

  await writeFile(configPath, JSON.stringify(config, null, 2));
}

function createProjectMapping(
  projectName: string,
  isRelative: boolean,
): [string, string] {
  const basePath = isRelative ? '..' : 'projects';

  if (projectName === 'lib-styled-system') {
    return createStyledSystemMapping(isRelative);
  }

  const packageName = projectName.replace(/^(lib|app)-/, '');

  return [`@vers/${packageName}`, `${basePath}/${projectName}/src`];
}

function createStyledSystemMapping(isRelative: boolean): [string, string] {
  const basePath = isRelative ? '..' : 'projects';

  return [
    '@vers/styled-system/*',
    `${basePath}/lib-styled-system/styled-system/*`,
  ];
}
