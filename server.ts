import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

const fastify: FastifyInstance = require('fastify')({ logger: true })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

interface IdParam {
    id: number
}

interface BodyParam {
    title: string;
    author: string;
    content: string;
}

// async function main() {
//   const news = await prisma.news.create({
//     data: {
//       title: 'Test title 3',
//       author: 'Test author 3',
//       content: 'Test content 3'
//     }
//   })
//   return news
// }

const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

fastify.get('/news', async (request: any, reply: any) => {
    const getAllNews = await prisma.news.findMany()
    reply.send(getAllNews)
})

fastify.get<{Params: IdParam}>('/news/:id', async (request, reply) => {
    const { id } = request.params
    const news = await prisma.news.findUnique({
        where: {
            id: Number(id)
        }
    })
    reply.send(news)
})

fastify.post<
    { Body: BodyParam }>
    ('/news',
        async (request, reply) => {
            const { title, author, content } = request.body;
            const news = await prisma.news.create({
                data: {
                    title,
                    author,
                    content
                },
            });
            reply.send(news);
        });

fastify.put<{ Body: BodyParam; Params: IdParam}>('/news/:id', async (request, reply) => {
    const { id } = request.params;
    const { title, author, content } = request.body;
    const news = await prisma.news.update({
        where: {
            id: Number(id),
        },
        data: {
            title,
            author,
            content
        }
    })
    reply.send(news);
})

fastify.delete<{Params: IdParam}>('/news/:id', async (request, reply) => {
    const { id } = request.params;
    const news = await prisma.news.delete({
        where: {
            id: Number(id),
        },
    })
    reply.send(news);
})
// main().catch((err) => {
//   console.error(err)
//   process.exit(1)
// })

start()