import {varToString} from "./utilities";

export const createBooksTable = () => {
    const booksTable = {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            AttributeDefinitions: [
                {
                    AttributeName: 'bookId',
                    AttributeType: 'S'
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
            KeySchema: [
                {
                    AttributeName: 'bookId',
                    KeyType: 'HASH',
                },
            ],
            Tags: [
                {
                    Key: 'Name',
                    Value: 'books-table'
                },
            ]
        }
    }
    return {
        resources: {booksTable},
        name: {Ref: varToString({booksTable})},
        arn: {"Fn::GetAtt": [varToString({booksTable}), "Arn"]},
    };
}