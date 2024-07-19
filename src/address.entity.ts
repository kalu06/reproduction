import { Entity, PrimaryKey, Property, OneToOne, OneToMany, ManyToOne } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity()
export class City {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  constructor(name: string) {
    this.name = name;
  }

}


@Entity()
export class Address {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @OneToOne(() => User, (user: User) => user.address, { nullable: true, owner: false })
  user?: User;

  @ManyToOne(() => City)
  city!: City;

  constructor(name: string) {
    this.name = name;
  }

}
