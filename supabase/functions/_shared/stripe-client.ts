
import Stripe from "https://esm.sh/stripe@13.10.0";

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use latest API version
  httpClient: Stripe.createFetchHttpClient(),
});
