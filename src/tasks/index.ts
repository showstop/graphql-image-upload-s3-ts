import { gql } from 'apollo-server-express';
import fs from 'fs';

const default_schema = gql`
    scalar Date
    scalar DateTime
    scalar BigInt

    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
    type Subscription {
        _: Boolean
    }
`;

let all_schemas = [default_schema, ];
let all_resolvers: Array<any> = [];

fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach((file) => {
        const local_path = './' + file;

        let declared_map = require(local_path);
        Object.keys(declared_map).forEach(key => {
            if(key.includes('Schema')) {
                all_schemas.push(declared_map[key]);
            }
            else {
                all_resolvers.push(declared_map[key]);
            }
        })
    });

export {
    all_schemas as schemas,
    all_resolvers as resolvers,
}