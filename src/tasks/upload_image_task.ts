import { gql } from 'apollo-server-express';

const upload_image_schema = gql`

    type InfoAns {
        result_code : Boolean
    }

    type UploadImageAns {
        result_code: Boolean
        image_url: String
    }

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    extend type Query {
        InfoReq: InfoAns
    }

    extend type Mutation {
        UploadImageReq(file: Upload): UploadImageAns!
    }
`;

import AWS from 'aws-sdk';

const upload_image_resolvers = {
    Query: {
        InfoReq: async(parent: any, args: any, context: any, info: any) => {

            // Write your code.

            return {
                result_code: false,
            }
        },
    },
    Mutation: {
        UploadImageReq: async(parent: any, args: any, context: any, info: any) => {
            const { filename, mimetype, encoding, createReadStream } = await args.file;
            const { variable, me } = context;

            let result = {
                result_code: true,
                image_url: ''
            }

            const s3 = new AWS.S3({
                accessKeyId: 'YOUR ACCESS KEY',
                secretAccessKey: 'YOUR SECRET KEY',
                region: 'ap-northeast-2',
            });

            let params = {
                'Bucket': 'YOUR_BUCKET_NAME',
                'Key': 'YOUR_S3_KEY/' + filename,
                'ACL': 'public-read',
                'Body': createReadStream(),
                'ContentType': mimetype
            };
            try {
                let upload_result = await s3.upload(params).promise();
                console.log(upload_result);
                result['image_url'] = upload_result['Location'];
            }
            catch(e) {
                console.log(e);
                result['result_code'] = false;
            }

            return result;
        },
    }
}

module.exports = {
    UploadImageSchema: upload_image_schema,
    UploadImageResolvers: upload_image_resolvers,
}