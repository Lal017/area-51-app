export type AmplifyDependentResourcesAttributes = {
  "api": {
    "area51RestApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "area51app": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "troplocksmithapp": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "HostedUIDomain": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "OAuthMetadata": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    },
    "userPoolGroups": {
      "AdminsGroupRole": "string",
      "CustomersGroupRole": "string",
      "TowDriversGroupRole": "string"
    }
  },
  "function": {
    "area51AddUserToTowDriversGroup": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "area51GetAppointments": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "area51GetMapStyle": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "area51GetRoute": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "area51SendNotifToAdmins": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "area51SendNotifToDrivers": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "area51UpdateTrackerLocation": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "troplocksmithappPostConfirmation": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "troplocksmithappPreSignup": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "geo": {
    "area51LocationSearch": {
      "Arn": "string",
      "Name": "string",
      "Region": "string"
    },
    "area51Map": {
      "Arn": "string",
      "Name": "string",
      "Region": "string",
      "Style": "string"
    }
  },
  "storage": {
    "area51Files": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}