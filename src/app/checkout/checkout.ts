import type Stripe from 'stripe';

export type CheckoutItem = {
  productId: number;
  quantity: number;
};

type CheckoutProduct = {
  id: number;
  name: string;
  price: number;
};

export function parseCheckoutItems(value: unknown): CheckoutItem[] | null {
  if (
    typeof value !== 'object'
    || value === null
    || !('items' in value)
    || !Array.isArray(value.items)
    || value.items.length === 0
    || value.items.length > 100
  ) {
    return null;
  }

  const quantities = new Map<number, number>();
  for (const item of value.items) {
    if (
      typeof item !== 'object'
      || item === null
      || !('productId' in item)
      || !('quantity' in item)
      || !Number.isSafeInteger(item.productId)
      || item.productId <= 0
      || !Number.isSafeInteger(item.quantity)
      || item.quantity <= 0
    ) {
      return null;
    }

    const quantity = (quantities.get(item.productId) ?? 0) + item.quantity;
    if (!Number.isSafeInteger(quantity)) {
      return null;
    }
    quantities.set(item.productId, quantity);
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}

export function buildStripeLineItems(
  items: CheckoutItem[],
  products: CheckoutProduct[],
): Stripe.Checkout.SessionCreateParams.LineItem[] | null {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) {
      return null;
    }

    const amountInCents = product.price * 100;
    const roundedAmountInCents = Math.round(amountInCents);
    if (
      !Number.isFinite(amountInCents)
      || roundedAmountInCents < 1
      || !Number.isSafeInteger(roundedAmountInCents)
      || Math.abs(amountInCents - roundedAmountInCents) > 0.000001
    ) {
      throw new Error(`Product ${product.id} has an invalid USD price`);
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: product.name },
        unit_amount: roundedAmountInCents,
      },
      quantity: item.quantity,
    });
  }

  return lineItems;
}
