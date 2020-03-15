import { BaseProperty, BaseRecord, BaseResource, Filter } from 'admin-bro';
import firebase from 'firebase';
import { BaseRecordFactory } from './utils/base-record.factory';
import { getEmptyInstance, Schema, toProperties } from './utils/schema';
import { ParamsType } from 'admin-bro/types/src/backend/adapters/base-record';
import firestoreRepository, {
  FirestoreRepository,
} from './firestore.repository';
import { unflatten } from 'flat';
import { last } from 'lodash';
import { getFieldToSortBy } from './utils/order';
import DocumentData = firebase.firestore.DocumentData;

class FirestoreResource extends BaseResource {
  private static DB_TYPE = 'Firestore';

  private readonly collectionId: string;
  private readonly schema: Schema;

  private baseResourceFactory: BaseRecordFactory;
  private repository: FirestoreRepository;

  constructor({ collection, schema }) {
    super(collection);
    this.collectionId = collection.id;
    this.schema = schema;
    this.baseResourceFactory = new BaseRecordFactory(this, this.schema);
    this.repository = firestoreRepository(collection);

    this.toBaseRecord = this.toBaseRecord.bind(this);
  }

  static isAdapterFor(resource): boolean {
    return resource?.collection?.firestore;
  }

  id(): string {
    return this.collectionId;
  }

  databaseName(): string {
    return FirestoreResource.DB_TYPE;
  }

  databaseType(): string {
    return FirestoreResource.DB_TYPE;
  }

  name(): string {
    return this.id();
  }

  properties(): BaseProperty[] {
    return toProperties(this.schema);
  }

  property(path): BaseProperty {
    return toProperties(this.schema).find(property => property.path() === path);
  }

  // TODO: Filtering
  async count(): Promise<number> {
    return this.repository.count();
  }

  // TODO: Filtering
  async find(
    filter: Filter,
    options: {
      limit?: number;
      offset?: number;
      sort?: { sortBy?: string; direction?: 'asc' | 'desc' };
    } = {
      offset: 0,
    }
  ): Promise<BaseRecord[]> {
    const sortBy = getFieldToSortBy(options, this.schema);

    const previousPage = (
      await this.repository
        .find()
        .orderBy(sortBy, options.sort.direction)
        .limit(options.offset || options.limit)
        .get()
    ).docs;

    if (!options.offset) {
      return previousPage.map(this.toBaseRecord);
    }
    const currentPage = (
      await this.repository
        .find()
        .orderBy(sortBy, options.sort.direction)
        .startAfter(last(previousPage).data()[sortBy])
        .limit(options.limit)
        .get()
    ).docs;

    return currentPage.map(this.toBaseRecord);
  }

  // TODO: Filtering by ids
  findMany(): Promise<Array<BaseRecord>> {
    return this.find(new Filter({}, this), {});
  }

  async findOne(id: string): Promise<BaseRecord | null> {
    const record = await this.repository.findOne(id);
    return this.toBaseRecord(record);
  }

  async update(
    id: string,
    updateData: Record<string, unknown>
  ): Promise<ParamsType> {
    const record = await this.repository.updateOne(id, updateData);
    return this.toBaseRecord(record);
  }

  async create(params: Record<string, unknown>): Promise<ParamsType> {
    const instance = Object.assign(
      getEmptyInstance(this.schema),
      unflatten(params)
    );

    const record = await this.repository.create(instance);
    return this.toBaseRecord(record);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private toBaseRecord(record: DocumentData): BaseRecord {
    return this.baseResourceFactory.toBaseRecord(record);
  }

  async populate(records: BaseRecord[]): Promise<BaseRecord[]> {
    return records.map(record => {
      return new BaseRecord(
        {
          ...record.toJSON().params,
          populated: {
            location: {
              longitude: 1,
              latitude: 1,
            },
          },
        },
        this
      );
    });
  }
}

export default FirestoreResource;
