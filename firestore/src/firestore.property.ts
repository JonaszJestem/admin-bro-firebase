import { BaseProperty, PropertyType } from 'admin-bro';
import { FirestorePropertyType, Schema, toProperties } from './utils/schema';
import { convertToAdminProperty } from './utils/property';

export class FirestoreProperty extends BaseProperty {
  private readonly propertyPosition: number = 0;
  private readonly propertyPath: string;
  private readonly propertyType: FirestorePropertyType;
  private readonly schema?: Schema;
  private readonly referenceName: string = '';

  constructor({
    path,
    position = 0,
    type = 'string',
    schema,
    isId = false,
    referenceName = '',
  }: {
    path: string;
    position?: number;
    isId?: boolean;
    type?: FirestorePropertyType;
    schema?: Schema;
    referenceName?: string;
  }) {
    super({ path, isId });
    this.propertyType = referenceName ? 'reference' : type;
    this.propertyPosition = position;
    this.referenceName = referenceName;
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
    if (this.type() === 'reference') {
      return this.referenceName;
    }
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
    return this.propertyType === 'array';
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
    return convertToAdminProperty(this.propertyType);
  }

  isSortable(): boolean {
    return this.type() !== 'mixed' && !this.isArray();
  }

  isRequired(): boolean {
    return false;
  }
}
