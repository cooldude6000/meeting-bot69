import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

export async function createEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
    })

    return response.data[0].embedding
}

export async function createManyEmbeddings(texts: string[]) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts
    })

    return response.data.map(item => item.embedding)
}

export async function chatWithAI(systemPrompt: string, userQuestion: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userQuestion
            }
        ],
        temperature: 0.7,
        max_tokens: 500
    })

    return response.choices[0].message.content || 'sorry, I could not generate a response.'
}