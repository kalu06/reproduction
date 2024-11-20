import { Entity, MikroORM, PrimaryKey, Property, Unique } from '@mikro-orm/mysql';
import { Point, PointType } from './point.type';

@Entity()
class Shop {

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique() // for the upsert to work
  name: string;

  @Property({ type: PointType })
  point: Point;

  constructor(name: string, email: string, point: Point) {
    this.name = name;
    this.point = point;
  }

}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: 'mikro_orm_test',
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    entities: [Shop],
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test('basic CRUD example', async () => {
  orm.em.upsert(Shop, { name: 'Foo', point: new Point(1, 2) });
  await orm.em.flush(); // fails with DriverException: (value || "").trim is not a function
  orm.em.clear();
});
