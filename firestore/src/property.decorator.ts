import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export const decorators = {
  date: (value?: Record<string, number>) => {
    if (!value) return value;
    const { seconds, nanoseconds } = value;
    return new Timestamp(seconds, nanoseconds).toDate();
  },
};
