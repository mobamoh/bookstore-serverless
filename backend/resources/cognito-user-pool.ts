import {varToString} from "@resources/utilities";

export const createUserPool = () => {
    const myCognitoUserPool = {
        Type: "AWS::Cognito::UserPool",
        Properties: {
            UserPoolName: "myCognitoUserPool",
            UsernameAttributes: ["email"],
        }
    }

    const myCognitoUserPoolClient = {

        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
            ClientName: "myCognitoUserPoolClient",
            UserPoolId: {
                Ref: "myCognitoUserPool"
            }
        }
    }

    const myCognitoCustomerGroup = {
        Type: "AWS::Cognito::UserPoolGroup",
        Properties: {
            GroupName: "myCognitoCustomerGroup",
            UserPoolId: {
                Ref: "myCognitoUserPool"
            },
            Precedence: 1,
            RoleArn: {
                "Fn::GetAtt": ["myCognitoCustomerIAMRole", "Arn"]
            }
        }
    }

    const myCognitoCustomerIAMRole = {
        Type: "AWS::IAM::Role",
        Properties: {
            AssumeRolePolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            Federated: "cognito-identity.amazonaws.com"
                        },

                        Action: ["sts:AssumeRoleWithWebIdentity"],
                    },
                ]
            },
            Policies: [
                {
                    PolicyName: "myCognitoCustomerIAMRolePolicy",
                    PolicyDocument: {
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: ["dynamodb:GetItem", "dynamodb:BatchGetItem", "dynamodb:Query"],
                                Resource: {
                                    "Fn::GetAtt": ["booksTable", "Arn"]
                                }
                            },
                        ]
                    }
                },
            ]
        }
    }

    const myCognitoAdminGroup = {

        Type: "AWS::Cognito::UserPoolGroup",
        Properties: {
            GroupName: "myCognitoAdminGroup",
            UserPoolId: {
                Ref: "myCognitoUserPool"
            },
            Precedence: 0,
            RoleArn: {
                "Fn::GetAtt": ["myCognitoAdminIAMRole", "Arn"]
            }
        }
    }

    const myCognitoAdminIAMRole = {
        Type: "AWS::IAM::Role",
        Properties: {
            AssumeRolePolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            Federated: "cognito-identity.amazonaws.com"
                        },
                        Action: ["sts:AssumeRoleWithWebIdentity"],
                    },
                ],
            },
            Policies: [
                {
                    PolicyName: "myCognitoAdminIAMRolePolicy",
                    PolicyDocument: {
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: ["dynamodb:*"],
                                Resource: {
                                    "Fn::GetAtt": ["booksTable", "Arn"]
                                }
                            },
                        ]
                    }
                }
            ]
        }
    }

    return {
        resources: {
            myCognitoUserPool,
            myCognitoUserPoolClient,
            myCognitoCustomerGroup,
            myCognitoCustomerIAMRole,
            myCognitoAdminGroup,
            myCognitoAdminIAMRole,
        },
        name: {Ref: varToString({myCognitoUserPool})},
        arn: {"Fn::GetAtt": [varToString({myCognitoUserPool}), "Arn"]},
    }
}