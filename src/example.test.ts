import { MikroORM } from '@mikro-orm/sqlite';
import { Address, City } from './address.entity';
import { User } from './user.entity';

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

test('populating a relation of a loaded entity should work', async () => {
  // create a new user with an address
  const city = orm.em.create(City, { name: 'Geneva' });
  const address = orm.em.create(Address, { name: '123 Street', city });
  orm.em.create(User, { name: 'Foo', email: 'foo', address });
  await orm.em.flush();
  orm.em.clear();

  // do not populate the address for now
  const user = await orm.em.findOneOrFail(User, { email: 'foo'});
  expect(user.name).toBe('Foo');

  // then populate the address relation of user
  const userAddress = user.address;
  const loadedAddress = await orm.em.populate(userAddress, ['city']);
  expect(loadedAddress.city).toBeDefined(); // fails
});
