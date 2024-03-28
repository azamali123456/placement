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
    if (user.role == 'Employeer') {
      can(Action.Manage, 'all'); // read-write access to everything
      caslPermissions.push({ action: Action.Manage, subject: 'all' });
    } else {
      //const dbPermissions = [{action:'Read',subject:'User'},{action:'Delete',subject:'Cat'},]
      //can(Action.Update, Article, { authorId: user.id });
      //cannot(Action.Delete, Article, { isPublished: true });
    }

    return new Ability<[Action, Subjects]>(caslPermissions);
  }
}
