import crypto from 'crypto'


export function verifySlackSignature(body: string, signature: string, timestamp: string) {
    const signingSecret = process.env.SLACK_SIGNING_SECRET!
    const time = Math.floor(new Date().getTime() / 1000)

    if (Math.abs(time - parseInt(timestamp)) > 300) {
        return false
    }

    const sigBaseString = `v0:${timestamp}:${body}`

    const mySignature = 'v0=' + crypto
        .createHmac('sha256', signingSecret)
        .update(sigBaseString, 'utf8')
        .digest('hex')

    return crypto.timingSafeEqual(
        Buffer.from(mySignature, 'utf8'),
        Buffer.from(signature, 'utf8')
    )
}