import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from './firebaseAuth';

export const db = getFirestore(app);

export const updateTransaction = async (transaction: {
  price: number;
  type: string;
  place: string;
  date: string;
  category: string;
  description: string;
}, id: number) => {
  try {
    await setDoc(doc(db, 'transactions', 'teste01'), {
      ...transaction,
      id: id
    });

  } catch (err) {
    console.error(err);
    alert('An error occured while fetching user data');
  }
};