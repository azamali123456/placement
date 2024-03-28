import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslService } from './casl.service';
@Global()
@Module({
  providers: [CaslAbilityFactory, CaslService],
  exports: [CaslAbilityFactory, CaslService],
})
export class CaslModule {}
