import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { insertProducts } from './insert-data.ts';

describe('insertProducts', () => {
  it('inserts all catalog products and skips existing records', async () => {
    let received:
      | Parameters<Parameters<typeof insertProducts>[0]['product']['createMany']>[0]
      | undefined;
    const result = { count: 10 };
    const client: Parameters<typeof insertProducts>[0] = {
      product: {
        createMany: async (args) => {
          received = args;
          return result;
        },
      },
    };

    const inserted = await insertProducts(client);

    assert.strictEqual(inserted, result);
    assert.ok(received);
    assert.equal(received.skipDuplicates, true);
    assert.deepEqual(
      received.data.map(({ slug }) => slug),
      [
        'rainbow-cloud',
        'pink-crunch',
        'sunkissed-orange',
        'starry-clear',
        'yarn-essentials-kit',
        'gouache-paint',
        'paint-journal',
        'washi-tape',
        'paint-brush-set',
        'knitting-essentials-kit',
      ],
    );
  });

  it('propagates database errors', async () => {
    const databaseError = new Error('Database unavailable');
    const client: Parameters<typeof insertProducts>[0] = {
      product: {
        createMany: async () => {
          throw databaseError;
        },
      },
    };

    await assert.rejects(insertProducts(client), (error) => error === databaseError);
  });
});
