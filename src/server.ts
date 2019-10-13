import express from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { schemas, resolvers } from './tasks';

class Server {

    private app_: express.Application;
    private listen_port_: number;

    constructor() {
        this.app_ = express();
        this.listen_port_ = 5000;
    }

    public start() {
        this.init_serv();
    }

    private init_serv() {

        const server = new ApolloServer(
            {
                introspection: true,
                playground: true,
                typeDefs: schemas,
                resolvers: resolvers,
                formatError: error => {
                    const message = error.message
                      return {
                        error,
                        message,
                      };
                  },
                  context: async ({ req }) => { 
                    let variable = req.body.variables
                    if (req) {
                      return {
                        variable,
                      };
                    }
                  },
            },
        );
        let app = this.app_;
        server.applyMiddleware({ app, path: '/graphql' });
        const http_server = http.createServer(this.app_);
        server.installSubscriptionHandlers(http_server);
        
        http_server.listen(this.listen_port_, () => {
            console.log(`Apollo Server on http://localhost:${this.listen_port_}/graphql`);
        });
    }

}

export default Server;