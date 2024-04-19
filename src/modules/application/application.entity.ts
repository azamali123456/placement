import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @ApiProperty()
  jobNumber!: number;

  @Column()
  @ApiProperty()
  companyName!: string;

  @Column()
  @ApiProperty()
  jobTitle!: number;

  @Column()
  @ApiProperty()
  jobAddress!: number;

  @Column()
  @ApiProperty()
  userId!: number;

  @Column()
  @ApiProperty()
  firstName!: string;

  @Column()
  @ApiProperty()
  lastName!: string;

  @Column()
  @ApiProperty()
  email!: string;

  @Column()
  @ApiProperty()
  phone!: number;

  @Column()
  @ApiProperty()
  city!: string;

  @Column()
  @ApiProperty()
  country!: string;

  @Column()
  @ApiProperty()
  education!: string;

  @Column()
  @IsBoolean()
  @ApiProperty()
  willingToRelocate!: boolean;

  @Column()
  @IsBoolean()
  @ApiProperty()
  legallyFullTimeInUsa!: boolean;

  @Column()
  // @IsBoolean()
  @ApiProperty()
  eligibilityFullTimeInUsa!: string;

  @Column()
  @ApiProperty()
  coverLater!: string;

  @Column()
  @ApiProperty()
  cv!: string;
}
