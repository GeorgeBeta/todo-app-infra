import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { IdentityPool, UserPoolAuthenticationProvider } from "aws-cdk-lib/aws-cognito-identitypool";
import { Construct } from "constructs";

export class CognitoStack extends Stack {
	public readonly userPoolId: CfnOutput;
	public readonly userPoolClientId: CfnOutput;
	public readonly identityPoolId: CfnOutput;
	public readonly userPoolArn: CfnOutput;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Crear el "User Pool"
        const userPool = new UserPool(this, 'UserPoolTodoWebApp', {
            userPoolName: 'UserPoolTodoWebApp',
            selfSignUpEnabled: true,        // Permite que el usuario sign up
            autoVerify: { email: true },    // Verificar el email del usuario enviando un código de verificación
            signInAliases: { email: true }, // Fijar el email com un alias
        });

        //Crear el "User Pool Client"
        const userPoolClient = new UserPoolClient(
            this,
            'UserPoolClientTodoWebApp',
            {
                userPool,
                generateSecret: false,  // No es necesario generar un secreto para la aplicación web que se 
                                        // ejecuta en los navegadores
            }
        );

        // Crear un "Identity Pool"
        const identityPool = new IdentityPool(this, 'IdentityPoolTodoWebApp', {
            allowUnauthenticatedIdentities: true,
            authenticationProviders: {
                userPools: [
                    new UserPoolAuthenticationProvider({
                        userPool: userPool,
                        userPoolClient: userPoolClient,
                    })
                ],
            }
        })

        this.userPoolId = new CfnOutput(this, 'CFUserPoolTodoWebApp', {
			value: userPool.userPoolId,
		});
		this.userPoolClientId = new CfnOutput(this, 'CFUserPoolClientTodoWebApp', {
			value: userPoolClient.userPoolClientId,
		});
		this.identityPoolId = new CfnOutput(this, 'CFIdentityPoolTodoWebApp', {
			value: identityPool.identityPoolId,
		});
		this.userPoolArn = new CfnOutput(this, 'CFUserPoolArnTodoWebApp', {
			value: userPool.userPoolArn,
		});
    }
}