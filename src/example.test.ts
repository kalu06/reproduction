import { Entity, MikroORM, PrimaryKey, Property } from '@mikro-orm/sqlite';

@Entity()
class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Property({ nullable: true })
  foo: number | null

  constructor(name: string, email: string, foo: number | null = null) {
    this.name = name;
    this.email = email;
    this.foo = foo;
  }

}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ':memory:',
    entities: [User],
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test('basic CRUD example', async () => {
  // raises a type error on foo
  orm.em.create(User, { name: 'Foo', email: 'foo', foo: new Date() });

  const user = new User('Foo', 'foo@example.com');
  // no type error on assign on foo?
  orm.em.assign(user, { name: 'Foo', email: 'foo', foo: new Date() });
});
