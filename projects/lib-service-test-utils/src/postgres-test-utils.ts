import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import postgres, { Sql } from 'postgres';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@chrononomicon/postgres-schema';

const TEST_TEMPLATE_DB = 'test_template';
const TEST_DB_USER = 'test';
const TEST_DB_PASSWORD = 'test';

type PostgresTestConfig = {
  port: number;
};

interface IPostgresTestUtils {
  container: StartedPostgreSqlContainer | null;
  client: Sql | null;
  db: PostgresJsDatabase<typeof schema> | null;
  testDBClients: Record<string, Sql>;
  createTestDB: (config: PostgresTestConfig) => Promise<{
    db: PostgresJsDatabase<typeof schema>;
    teardown: () => Promise<void>;
  }>;
  initialize: (config: PostgresTestConfig) => Promise<void>;
  teardown: () => Promise<void>;
}

export const PostgresTestUtils: IPostgresTestUtils = {
  container: null,
  client: null,
  db: null,
  testDBClients: {},
  async createTestDB(config: PostgresTestConfig) {
    if (!this.container) {
      this.container = await createPostgresContainer(config);
    }

    const defaultClient = await createPostgresClient(
      this.container,
      'postgres',
    );

    const testDBID = createId();

    // create a new DB for this test from our pre-migrated template DB
    // for some reason we need to jump into unsafe mode otherwise `postgres` wont inline our params
    await defaultClient.unsafe(/* SQL */ `
      CREATE DATABASE test_${testDBID} TEMPLATE ${TEST_TEMPLATE_DB};
    `);

    await defaultClient.end();

    if (!this.client) {
      this.client = await createPostgresClient(this.container, testDBID);
    }

    const testDBConnectionString = `postgres://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${this.container.getHost()}:${this.container.getFirstMappedPort()}/test_${testDBID}`;
    const testDBClient = postgres(testDBConnectionString);
    const testDB = drizzle(testDBClient, { schema });

    // store a reference of the client so we can clean it up later
    this.testDBClients[testDBID] = testDBClient;

    const teardown = async () => {
      await testDBClient.end();

      delete this.testDBClients[testDBID];
    };

    return { db: testDB, teardown };
  },
  async initialize(config: PostgresTestConfig) {
    if (!this.container) {
      this.container = await createPostgresContainer(config);
    }

    if (!this.client) {
      this.client = await createPostgresClient(
        this.container,
        TEST_TEMPLATE_DB,
      );
    }

    if (!this.db) {
      this.db = drizzle(this.client, { schema });
    }

    const migrationPath = path.join(process.cwd(), '../db-postgres/migrations');

    await migrate(this.db, { migrationsFolder: migrationPath });

    // tear down client connection to the template DB
    await this.client.end();
  },
  async teardown() {
    if (this.client) {
      await this.client.end();
    }

    if (this.container) {
      await this.container.stop();
    }

    // loop over any remaining db clients and end their connection
    for (const client of Object.values(this.testDBClients)) {
      await client.end();
    }
  },
};

async function createPostgresContainer(
  config: PostgresTestConfig,
): Promise<StartedPostgreSqlContainer> {
  return await new PostgreSqlContainer('postgres:16.2-alpine3.19')
    .withDatabase(TEST_TEMPLATE_DB)
    .withUsername(TEST_DB_USER)
    .withPassword(TEST_DB_PASSWORD)
    // use a memory disk for perf
    .withTmpFs({ '/var/lib/pg/data': 'rw' })
    .withEnvironment({
      PGDATA: '/var/lib/pg/data',
    })
    .withExposedPorts({ host: config.port, container: 5432 })
    // allow reusing our container across tests
    .withReuse()
    .start();
}

async function createPostgresClient(
  container: StartedPostgreSqlContainer,
  database: string,
): Promise<Sql> {
  const connectionString = `postgres://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${container.getHost()}:${container.getFirstMappedPort()}/${database}`;

  return postgres(connectionString);
}
