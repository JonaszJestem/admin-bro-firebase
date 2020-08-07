import { getEmptyInstance, Schema } from './schema';

describe('Schema', () => {
  describe('getEmptyInstance', () => {
    it('should construct empty instance from array based schema', async () => {
      const schema: Schema = ['id', 'name'];
      const emptyInstance = getEmptyInstance(schema);

      expect(emptyInstance).toEqual({ id: null, name: null });
    });

    it('should construct empty instance from flat simple object based schema', async () => {
      const schema: Schema = { id: 'string', name: 'string' };
      const emptyInstance = getEmptyInstance(schema);

      expect(emptyInstance).toEqual({ id: null, name: null });
    });

    it('should construct empty instance from flat object based schema', async () => {
      const schema: Schema = {
        id: { type: 'string' },
        name: { type: 'string' },
      };
      const emptyInstance = getEmptyInstance(schema);

      expect(emptyInstance).toEqual({ id: null, name: null });
    });

    it('should construct empty instance from nested object based schema', async () => {
      const schema: Schema = {
        id: 'string',
        attributes: { type: 'mixed', schema: { name: 'string' } },
      };
      const emptyInstance = getEmptyInstance(schema);

      expect(emptyInstance).toEqual({ id: null, attributes: { name: null } });
    });
  });
});
