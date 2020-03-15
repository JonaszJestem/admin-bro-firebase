import { Schema } from 'admin-bro-firebase';

export const userSchema: Schema = {
  name: 'string',
  age: 'number',
  isAdmin: 'boolean',
  attributes: {
    type: 'mixed',
    schema: {
      birthdate: 'date',
      height: 'number',
      eyeColors: 'array',
    },
  },
  location: {
    referenceName: 'Locations',
  },
};
