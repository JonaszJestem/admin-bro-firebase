/* eslint-disable @typescript-eslint/explicit-function-return-type */
import firebase from 'firebase';
import CollectionReference = firebase.firestore.CollectionReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import UpdateData = firebase.firestore.UpdateData;

export type FirestoreRepository = {
  find: () => CollectionReference<DocumentType>;

  findOne: (id: string) => Promise<DocumentSnapshot>;

  delete: (id: string) => Promise<void>;

  count: () => Promise<number>;

  updateOne: (
    id: string,
    updatedRecord: UpdateData
  ) => Promise<DocumentSnapshot>;

  create: (record) => Promise<DocumentSnapshot>;
};
const firestoreRepository = (
  collection: CollectionReference<DocumentType>
): FirestoreRepository => ({
  findOne: (id: string) => collection.doc(id).get(),

  find: () => collection,

  delete: (id: string) => collection.doc(id).delete(),

  count: async () => (await collection.get()).docs.length,

  async updateOne(id: string, updatedRecord: UpdateData) {
    await collection.doc(id).update(updatedRecord);
    return this.findOne(id);
  },

  async create(record: DocumentType) {
    const createdDocument = collection.doc();
    await createdDocument.set(record);
    return collection.doc(createdDocument.id).get();
  },
});

export default firestoreRepository;
