import { BaseProperty, PropertyType } from 'admin-bro';
import { Schema, toProperties } from './utils/schema';

export class FirestoreProperty extends BaseProperty {
  private readonly propertyPosition: number = 0;
  private readonly propertyPath: string;
  private readonly propertyType: PropertyType;
  private readonly schema?: Schema;

  constructor({
    path,
    position = 0,
    type = 'string',
    schema,
    isId = false,
  }: {
    path: string;
    position?: number;
    isId?: boolean;
    type?: PropertyType;
    schema?: Schema;
  }) {
    super({ path, isId });
    this.propertyType = type;
    this.propertyPosition = position;
    this.propertyPath = path;
    this.schema = schema;
  }

  name(): string {
    return this.propertyPath;
  }

  isEditable(): boolean {
    return !this.isId();
  }

  // TODO: Implement
  reference(): string {
    return '';
  }

  isVisible(): boolean {
    return !this.name().match('password');
  }

  isId(): boolean {
    return this.name().toLowerCase() === 'id';
  }

  // TODO: Implement
  availableValues(): string[] | null {
    return null;
  }

  // TODO: Implement
  isArray(): boolean {
    return false;
  }

  subProperties(): BaseProperty[] {
    if (this.type() === 'mixed' && this.schema) {
      return toProperties(this.schema);
    }
    return [];
  }

  position(): number {
    return this.propertyPosition;
  }

  type(): PropertyType {
    return this.propertyType;
  }

  isSortable(): boolean {
    return this.type() !== 'mixed' && !this.isArray();
  }
}
