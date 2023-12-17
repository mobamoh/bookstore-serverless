import {varToString} from "@resources/utilities";
import {AwsCfInstruction} from "@serverless/typescript";

export const createAppSyncAPI = (myUserPoolRef: AwsCfInstruction, ddbUserTable: AwsCfInstruction) => {
    const appSync = {
        name: "my-app-sync-api",
        // schema: "schema.graphql",
        authentication: {
            type: "AMAZON_COGNITO_USER_POOLS",
            config: {
                userPoolId: myUserPoolRef,
            }
        },
        additionalAuthentications: [
            {
                type: "AWS_IAM",
            }
        ],
        resolvers: {
            getBookById: {
                kind: "UNIT",
                type: "Query",
                field: "getBookById",
                dataSource: "booksTable",
                request: "mapping-templates/getBookById.request.vtl",
                response: "mapping-templates/getBookById.response.vtl",
            },
            listBooks: {
                kind: "UNIT",
                type: "Query",
                field: "listBooks",
                dataSource: "booksTable",
                request: "mapping-templates/listBooks.request.vtl",
                response: "mapping-templates/listBooks.response.vtl",
            },
            createBook: {
                kind: "UNIT",
                type: "Mutation",
                field: "createBook",
                dataSource: "booksTable",
                request: "mapping-templates/createBook.request.vtl",
                response: "mapping-templates/createBook.response.vtl",
            },
        },
        dataSources: {
            booksTable: {
                type: "AMAZON_DYNAMODB",
                config: {
                    tableName: ddbUserTable,
                }
            },
        }
    }

    return {
        resources: {appSync},
        name: {Ref: varToString({appSync})},
        arn: {"Fn::GetAtt": [varToString({appSync}), "Arn"]},
    };
}