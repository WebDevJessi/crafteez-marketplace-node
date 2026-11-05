import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { insertProducts, updateProductDescriptions } from './insert-data.ts';

describe('insertProducts', () => {
  it('inserts all catalog products and skips existing records', async () => {
    let received:
      | Parameters<Parameters<typeof insertProducts>[0]['product']['createMany']>[0]
      | undefined;
    const result = { count: 10 };
    const client: Parameters<typeof insertProducts>[0] = {
      category: {
        findUnique: async ({ where }) => {
          assert.equal(where.name, 'Slime');
          return { id: 17 };
        },
      },
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
    assert.ok(received.data.every(({ categoryId }) => categoryId === 17));
    assert.ok(received.data.every(({ description }) => description.trim().length > 0));
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
      category: {
        findUnique: async () => ({ id: 1 }),
      },
      product: {
        createMany: async () => {
          throw databaseError;
        },
      },
    };

    await assert.rejects(insertProducts(client), (error) => error === databaseError);
  });

  it('fails when the Slime category has not been seeded', async () => {
    let productsCreated = false;
    const client: Parameters<typeof insertProducts>[0] = {
      category: {
        findUnique: async () => null,
      },
      product: {
        createMany: async () => {
          productsCreated = true;
          return { count: 0 };
        },
      },
    };

    await assert.rejects(insertProducts(client), /Seed the Slime category/);
    assert.equal(productsCreated, false);
  });
});

describe('updateProductDescriptions', () => {
  it('updates descriptions by product slug without changing other fields', async () => {
    const updates: Array<{ slug: string; description: string }> = [];
    const client: Parameters<typeof updateProductDescriptions>[0] = {
      product: {
        updateMany: async ({ where, data }) => {
          updates.push({ slug: where.slug, description: data.description });
          return { count: 1 };
        },
      },
    };

    const result = await updateProductDescriptions(client);

    assert.equal(result.updated.length, 10);
    assert.deepEqual(result.missing, []);
    assert.ok(updates.every(({ description }) => description.length > 0));
    assert.deepEqual(
      updates.map(({ slug }) => slug),
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

  it('reports products that were not found', async () => {
    const client: Parameters<typeof updateProductDescriptions>[0] = {
      product: {
        updateMany: async () => ({ count: 0 }),
      },
    };

    const result = await updateProductDescriptions(client);

    assert.deepEqual(result.updated, []);
    assert.equal(result.missing.length, 10);
  });
});
