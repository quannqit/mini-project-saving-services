import { SQS } from 'aws-sdk';

import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'AWS_SQS',
      useFactory: () => {
        return new SQS({ apiVersion: '2012-11-05' });
      },
    },
  ],
  exports: ['AWS_SQS'],
})
export class AwsServicesModule {}
