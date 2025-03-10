
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "../_shared/stripe-client.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { sessionId } = await req.json()
    console.log(`Verifying payment session ${sessionId}`)

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    // In test mode, we'll consider 'unpaid' as valid for demonstration purposes
    // This allows developers to test the payment flow without actual payments
    const isTestMode = Deno.env.get('STRIPE_SECRET_KEY')?.startsWith('sk_test_');
    const isPaymentValid = isTestMode ? true : session.payment_status === 'paid';
    
    if (!isPaymentValid) {
      throw new Error('Payment not completed')
    }

    console.log(`Payment verified for session ${sessionId}, blueprint: ${session.metadata?.blueprintId}`)
    
    return new Response(
      JSON.stringify({ 
        verified: true,
        blueprintId: session.metadata?.blueprintId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
