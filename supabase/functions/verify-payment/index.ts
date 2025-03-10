
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
    
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed')
    }

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
