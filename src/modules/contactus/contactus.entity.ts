import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Contactus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @ApiProperty()
  firstName!: string;

  @Column()
  @ApiProperty()
  lastName!: string;

  @Column()
  @ApiProperty()
  companyName!: string;

  @Column()
  @ApiProperty()
  email!: string;

  @Column()
  @ApiProperty()
  @Length(24)
  message!: string;
}
