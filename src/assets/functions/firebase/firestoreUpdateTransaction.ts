import { doc, setDoc } from 'firebase/firestore';
import { db } from './setFirestoreAndAuth';

export const updateTransaction = async (transaction: {
  paymentMethod: string;
  place: string;
  price: number;
  date: string;
  category: string;
  description: string;
}, id: number) => {
  try {
    const dbDoc = doc(db, 'transactions', 'teste02');
    await setDoc(dbDoc, { ...transaction, id: id }, { merge: true } );

  } catch (err) {
    console.error(err);
    alert('An error occured while fetching user data');
  }
};