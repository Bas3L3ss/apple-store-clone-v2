import { stripe } from "../../utils/stripe";

async function fetchAllPayments() {
  const allPayments = [];
  let hasMore = true;
  let startingAfter = null;

  while (hasMore) {
    // Build request params dynamically
    const params: any = { limit: 100 };
    if (startingAfter) params.starting_after = startingAfter; // Add only if not null

    const response = await stripe.paymentIntents.list(params);

    allPayments.push(...response.data);
    hasMore = response.has_more;

    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return allPayments;
}

export { fetchAllPayments };
