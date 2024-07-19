import { Entity, PrimaryKey, Property, OneToOne } from "@mikro-orm/core";
import { Address } from "./address.entity";

@Entity()
export class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @OneToOne(() => Address, { owner: true })
  address!: Address;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

}
