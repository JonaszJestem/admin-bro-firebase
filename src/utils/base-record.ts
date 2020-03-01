import { BaseRecord } from 'admin-bro';
import BaseResource from 'admin-bro/types/src/backend/adapters/base-resource';
import { getSchemaPaths, Schema } from './schema';
import { pick } from 'lodash';
import DocumentData = firebase.firestore.DocumentData;

export class BaseRecordFactory {
  private readonly resource: BaseResource;
  private readonly schema: Schema;

  constructor(resource: BaseResource, schema: Schema) {
    this.resource = resource;
    this.schema = schema;
  }

  toBaseRecord(record: DocumentData): BaseRecord {
    return new BaseRecord(
      {
        ...pick(record.data(), getSchemaPaths(this.schema)),
        id: record.id,
      },
      this.resource
    );
  }
}
