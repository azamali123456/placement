import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './userRoles';

import { CaslService } from './casl.service';

export type Subjects = any;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private caslService: CaslService) {}
  async createForUser(user: any) {
    const { can } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );
    const caslPermissions = [];
    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all');
      caslPermissions.push({ action: Action.Manage, subject: 'all' });
    } else {
      can(Action.Manage, 'all', { inverted: true });
      caslPermissions.push({ action: Action.Manage, subject: 'all' });
    }
    return new Ability<[Action, Subjects]>(caslPermissions);
  }
}
