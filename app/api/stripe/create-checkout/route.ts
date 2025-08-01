import { prisma } from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil'
})

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        const user = await currentUser()

        if (!userId || !user) {
            return NextResponse.json({ error: 'not authenticated' }, { status: 401 })
        }

        const { priceId, planName } = await request.json()

        if (!priceId) {
            return NextResponse.json({ error: 'price Id is required' }, { status: 400 })
        }

        let dbUser = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    id: userId,
                    clerkId: userId,
                    email: user.primaryEmailAddress?.emailAddress,
                    name: user.fullName
                }
            })
        }

        let stripeCustomerId = dbUser?.stripeCustomerId

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.primaryEmailAddress?.emailAddress!,
                name: user.fullName || undefined,
                metadata: {
                    clerkUserId: userId,
                    dbUserId: dbUser.id
                }
            })

            stripeCustomerId = customer.id

            await prisma.user.update({
                where: {
                    id: dbUser.id
                },
                data: {
                    stripeCustomerId
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/home?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
            metadata: {
                clerkUserId: userId,
                dbUserId: dbUser.id,
                planName
            },
            subscription_data: {
                metadata: {
                    clerkUserId: userId,
                    dbUserId: dbUser.id,
                    planName
                }
            }
        })
        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('stripe checkout error:', error)
        return NextResponse.json({ error: 'failed to create checkout session' }, { status: 500 })
    }
}