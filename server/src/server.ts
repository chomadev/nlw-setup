import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './lib/routes'

var server = Fastify()
server.register(cors)
server.register(appRoutes)

server.listen({ port: 3333 })