import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from 'svix'

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text()
        const headers = {
            'svix-id': request.headers.get('svix-id') || '',
            'svix-timestamp': request.headers.get('svix-timestamp') || '',
            'svix-signature': request.headers.get('svix-signature') || '',
        }

        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
        if (webhookSecret) {
            const wh = new Webhook(webhookSecret)
            try {
                wh.verify(payload, headers)
            } catch (err) {
                return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 })
            }
        }

        const event = JSON.parse(payload)
        console.log('clerk webhook received', event.type)

        if (event.type === 'user.created') {
            const { id, email_addresses, first_name, last_name } = event.data
            const primaryEmail = email_addresses?.find((email: any) =>
                email.id === event.data.primary_email_address_id
            )?.email_address

            const newUser = await prisma.user.create({
                data: {
                    id: id,
                    clerkId: id,
                    email: primaryEmail || null,
                    name: `${first_name} ${last_name}`
                }
            })
            console.log('user created', newUser.id, newUser.email)
            return NextResponse.json({ message: "user created successfully" })
        }

        return NextResponse.json({ message: 'webhook received' })
    } catch (error) {
        console.error('webhook error:', error)
        return NextResponse.json({ error: 'Webhook processign failed' }, { status: 500 })
    }
}