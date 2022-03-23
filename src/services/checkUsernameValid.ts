import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'lib/firebase';

export const checkUsernameValid = async (username: string) => {
   let userExist;
   const q = query(collection(db, 'users'), where('username', '==', username));
   const querySnapshot = await getDocs(q);
   querySnapshot.forEach((doc) => {
      userExist = doc.data();
   });
   return !!userExist;
};
