import { BaseRecord } from 'admin-bro';
import BaseResource from 'admin-bro/types/src/backend/adapters/resource/base-resource';
import { getSchemaPaths, Schema } from './schema';
import { pick } from 'lodash';
import DocumentData = firebase.firestore.DocumentData;
import { decorators } from '../property.decorator';

export class BaseRecordFactory {
  private readonly resource: BaseResource;
  private readonly schema: Schema;

  constructor(resource: BaseResource, schema: Schema) {
    this.resource = resource;
    this.schema = schema;
  }

  toBaseRecord(record: DocumentData): BaseRecord {
    return new BaseRecord(
      Object.entries({
        ...pick(record.data(), getSchemaPaths(this.schema)),
        id: record.id,
      }).reduce(
        (previousValue, [key, value]) => ({
          ...previousValue,
          [key]: decorators[this.schema[key]]?.(value) ?? value,
        }),
        {}
      ),
      this.resource
    );
  }
}
