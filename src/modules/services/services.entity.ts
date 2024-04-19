import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Services extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ nullable: true })
  title!: string;

  @ApiProperty()
  @Column('simple-array', { nullable: true })
  pakages!: number[];
}
