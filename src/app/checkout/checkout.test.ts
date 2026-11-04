import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildStripeLineItems, parseCheckoutItems } from './checkout.ts';

describe('parseCheckoutItems', () => {
  it('accepts product IDs and quantities and combines duplicate products', () => {
    assert.deepEqual(
      parseCheckoutItems({
        items: [
          { productId: 7, quantity: 2, price: 0.01 },
          { productId: 3, quantity: 1 },
          { productId: 7, quantity: 3 },
        ],
      }),
      [
        { productId: 7, quantity: 5 },
        { productId: 3, quantity: 1 },
      ],
    );
  });

  it('rejects empty or invalid carts', () => {
    for (const value of [
      null,
      {},
      { items: [] },
      { items: [{ productId: 0, quantity: 1 }] },
      { items: [{ productId: 1, quantity: 0 }] },
      { items: [{ productId: '1', quantity: 1 }] },
      { items: [{ productId: 1, quantity: Number.MAX_SAFE_INTEGER }, { productId: 1, quantity: 1 }] },
    ]) {
      assert.equal(parseCheckoutItems(value), null);
    }
  });
});

describe('buildStripeLineItems', () => {
  it('uses database product names and USD prices expressed in cents', () => {
    assert.deepEqual(
      buildStripeLineItems(
        [{ productId: 5, quantity: 2 }],
        [{ id: 5, name: 'Craft kit', price: 20.25 }],
      ),
      [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Craft kit' },
          unit_amount: 2025,
        },
        quantity: 2,
      }],
    );
  });

  it('rejects unavailable products and invalid database prices', () => {
    assert.equal(buildStripeLineItems([{ productId: 5, quantity: 1 }], []), null);
    assert.throws(
      () => buildStripeLineItems(
        [{ productId: 5, quantity: 1 }],
        [{ id: 5, name: 'Invalid price', price: 0 }],
      ),
      /invalid USD price/,
    );
  });
});
