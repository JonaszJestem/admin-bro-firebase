import { BaseProperty, BaseRecord, BaseResource, Filter } from 'admin-bro';
import firebase from 'firebase';
import { BaseRecordFactory } from './utils/base-record.factory';
import { getEmptyInstance, Schema, toProperties } from './utils/schema';
import { ParamsType } from 'admin-bro/types/src/backend/adapters/index';
import firestoreRepository, {
  FirestoreRepository,
} from './firestore.repository';
import { unflatten } from 'flat';
import { last } from 'lodash';
import { getFieldToSortBy } from './utils/order';
import DocumentData = firebase.firestore.DocumentData;
import { uploadAndReplaceImageData } from './utils/image';

class FirestoreResource extends BaseResource {
  private static DB_TYPE = 'Firestore';
  private static DEFAULT_RECORDS_LIMIT = 10;
  private static DEFAULT_SORTING_DIRECTION: 'asc' | 'desc' = 'asc';

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

  property(path): BaseProperty | null {
    return (
      toProperties(this.schema).find(property => property.path() === path) ??
      null
    );
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
    }
  ): Promise<BaseRecord[]> {
    const sortBy = getFieldToSortBy(options, this.schema);
    const limit = options.limit || FirestoreResource.DEFAULT_RECORDS_LIMIT;
    const direction =
      options?.sort?.direction || FirestoreResource.DEFAULT_SORTING_DIRECTION;

    const previousPage = (
      await this.repository
        .find()
        .orderBy(sortBy, direction)
        .limit(options.offset || limit)
        .get()
    ).docs;

    if (!options.offset) {
      return previousPage.map(this.toBaseRecord);
    }
    const currentPage = (
      await this.repository
        .find()
        .orderBy(sortBy, direction)
        .startAfter(last(previousPage).data()[sortBy])
        .limit(limit)
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
    const data = await uploadAndReplaceImageData(updateData);
    const record = await this.repository.updateOne(id, data);
    return record.data();
  }

  async create(params: Record<string, unknown>): Promise<ParamsType> {
    const data = await uploadAndReplaceImageData(params);
    const emptyInstance = getEmptyInstance(this.schema);
    const instance = Object.assign(emptyInstance, unflatten(data));

    const record = await this.repository.create(instance);
    return record.data();
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
