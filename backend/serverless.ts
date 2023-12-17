import type {AWS} from '@serverless/typescript';
import {createBooksTable} from '@resources/ddb-books-table';
import {createUserPool} from '@resources/cognito-user-pool';
import {createAppSyncAPI} from '@resources/app-sync-api';
import hello from '@functions/hello';

const booksTable = createBooksTable();
const userPool = createUserPool();
const appSyncAPI = createAppSyncAPI(userPool.name, booksTable.name);

const serverlessConfiguration: AWS = {
    service: 'backend',
    frameworkVersion: '3',
    plugins: ['serverless-bundle', 'serverless-appsync-plugin'],
    provider: {
        name: 'aws',
        region: 'us-east-1',
        runtime: 'nodejs18.x',
        stage: 'dev',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    // import the function via paths
    functions: {hello},
    ...appSyncAPI.resources,
    resources: {
        Resources: {
            ...booksTable.resources,
            ...userPool.resources
        }
    },
    package: {individually: true},
    custom: {
        bundle: {
            sourcemaps: false, // Source maps are slow with the serverless-bundle. Only enable if needed
            // packager: "pnpm",
        },
    },
};

module.exports = serverlessConfiguration;
