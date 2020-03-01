export const userSchema: Schema = {
  name: 'string',
  age: 'number',
  isAdmin: 'boolean',
  location: 'mixed',
  attributes: {
    type: 'mixed',
    schema: {
      birthdate: 'date',
      height: 'number',
      eyeColors: 'mixed',
    },
  },
};
