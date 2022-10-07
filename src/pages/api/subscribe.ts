/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";
import { fauna } from "../../services/fauna";

interface User {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) =>{
  if(req.method === 'POST'){

    const session = await getSession({ req});

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    );

    let customerId = user.data.stripe_customer_id;

    if(!customerId){

      const striptCustomer = await stripe.customers.create({
        email: session.user.email
      });

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: striptCustomer.id
            }
          }
        )
      )

      customerId = striptCustomer.id
      
    }

    

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      line_items: [
        {price: 'price_1LkXCJHtEzaLw4DbWXIPXLQR', quantity:1}
      ],
      mode: 'subscription',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })
    return res.status(200).json({sessionId: stripeCheckoutSession.id })
  }else{
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed')
  }
}