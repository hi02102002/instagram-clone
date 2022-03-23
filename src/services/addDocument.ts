import { addDoc, collection } from 'firebase/firestore';
import { db } from 'lib/firebase';

export const addDocument = async (path: string, data: any) => {
   await addDoc(collection(db, path), {
      ...data,
   });
};
