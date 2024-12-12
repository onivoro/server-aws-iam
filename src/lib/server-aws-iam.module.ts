import { Module } from '@nestjs/common';
import { moduleFactory } from '@onivoro/server-common';
import { IAMClient } from '@aws-sdk/client-iam';
import { IamService } from './services/iam.service';
import { ServerAwsIamConfig } from './classes/server-aws-iam-config.class';

let iamClient: IAMClient | null = null;

@Module({})
export class ServerAwsIamModule {
  static configure(config: ServerAwsIamConfig) {
    return moduleFactory({
      module: ServerAwsIamModule,
      providers: [
        {
          provide: IAMClient,
          useFactory: () => iamClient
            ? iamClient
            : iamClient = new IAMClient({
              region: config.AWS_REGION,
              logger: console,
              credentials: config.NODE_ENV === 'production'
                ? undefined
                : {
                  accessKeyId: config.AWS_ACCESS_KEY_ID,
                  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
                }
            })
        },
        { provide: ServerAwsIamConfig, useValue: config },
        IamService
      ],
    })
  }
}
