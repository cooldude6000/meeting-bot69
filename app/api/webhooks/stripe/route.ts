import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const headersList = await headers()
        const sig = headersList.get('stripe-signature')!

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
        } catch (error) {
            console.error('webhok signature failed:', error)
            return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
        }

        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object)
                break
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object)
                break
            case 'customer.subscription.deleted':
                await handleSubscriptionCancelled(event.data.object)
                break
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object)
                break

            default:
                console.log(`unhandle type event: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('error handling subscription create:', error)
        return NextResponse.json({ error: 'webhook failed' }, { status: 500 })
    }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    try {
        const customerId = subscription.customer as string
        const planName = getPlanFromSubscription(subscription)

        const user = await prisma.user.findFirst({
            where: {
                stripeCustomerId: customerId
            }
        })

        if (user) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    currentPlan: planName,
                    subscriptionStatus: 'active',
                    stripeSubscriptionId: subscription.id,
                    billingPeriodStart: new Date(),
                    meetingsThisMonth: 0,
                    chatMessagesToday: 0
                }
            })
        }
    } catch (error) {
        console.error('error handling subscription create:', error)
    }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                stripeSubscriptionId: subscription.id
            }
        })

        if (user) {
            const planName = getPlanFromSubscription(subscription)

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    currentPlan: planName,
                    subscriptionStatus: subscription.status === 'active' ? 'active' : 'cancelled'
                }
            })
        }
    } catch (error) {
        console.error('error handling subscription updated:', error)
    }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                stripeSubscriptionId: subscription.id
            }
        })
        if (user) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    subscriptionStatus: 'cancelled'
                }
            })
        }
    } catch (error) {
        console.error('error handling subscription cancelleation:', error)
    }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    try {
        const subscriptionId = (invoice as any).subscription as string | null

        if (subscriptionId) {
            const user = await prisma.user.findFirst({
                where: {
                    stripeSubscriptionId: subscriptionId
                }
            })

            if (user) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        subscriptionStatus: 'active',
                        billingPeriodStart: new Date(),
                        meetingsThisMonth: 0
                    }
                })
            }
        }
    } catch (error) {
        console.error('error handling payment suucession:', error)
    }
}




function getPlanFromSubscription(subscription: Stripe.Subscription) {
    const priceId = subscription.items.data[0]?.price.id

    const priceToPlank: Record<string, string> = {
        'price_1RpqPqPM25qIcCJyMdRhoNah': 'starter',
        'price_1RpqPqPM25qIcCJyWkSDTdKN': 'pro',
        'price_1RpqPqPM25qIcCJyXD9K1yKM': 'premium'
    }

    return priceToPlank[priceId] || 'invalid'
}