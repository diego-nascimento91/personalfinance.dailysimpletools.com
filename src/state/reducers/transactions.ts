import { ITransaction } from 'utils/interfaces';
import { useLastAddedTransactions } from 'state/hooks/lastAddedTransactions';
import { useTransactions, useTransactionsFilter_byMonth } from 'state/hooks/transactions';
import { useUser } from 'state/hooks/user';
import { getDateQueries, getOrderConfig } from 'state/utils/transactions';
import { successToast } from 'state/utils/toast';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';


export const useFetchTransactionsMonth = () => {
  const [, setTransactions] = useTransactions();
  const [month] = useTransactionsFilter_byMonth();
  const [user] = useUser();

  return async () => {
    if (user) {
      const collectionPath = `users/${user.uid}/transactions`;
      const orderConfig = getOrderConfig();
      const query = getDateQueries(month);

      try {
        const data = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderConfig, query);
        setTransactions(data as ITransaction[]);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useAddNewTransaction = () => {
  const [month] = useTransactionsFilter_byMonth();
  const [user] = useUser();
  const [, setTransactions] = useTransactions();
  const [, setRecentTransactions] = useLastAddedTransactions();

  return async (transaction: ITransaction) => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/transactions`;
        const docRef = await FirebaseFirestoreService.createDocument(collectionPath, transaction);
        if (docRef) {
          const docUploaded = await FirebaseFirestoreService.readDocumentRef(docRef) as ITransaction;

          // adding new doc to the transactions state (only if the doc is the same month as the current chosen by user)
          if (month.getMonth() === docUploaded.date.getMonth()) {
            setTransactions(transactions => {
              return [docUploaded, ...transactions];
            });
          }

          // adding new doc to the last added transactions state
          setRecentTransactions(transactions => {
            return [docUploaded, ...transactions];
          });
          successToast('Transaction added successfully!');
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useAddNewTransferTransaction = () => {
  const [month] = useTransactionsFilter_byMonth();
  const [user] = useUser();
  const [, setTransactions] = useTransactions();
  const [, setRecentTransactions] = useLastAddedTransactions();

  return async (transactionFrom: ITransaction, transactionTo: ITransaction) => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/transactions`;
        const docFromRef = await FirebaseFirestoreService.createDocument(collectionPath, transactionFrom);
        if (docFromRef) {
          const docToRef = await FirebaseFirestoreService.createDocument(collectionPath, { ...transactionTo, transferedTransactionID: docFromRef.id });
          if (docToRef) {
            await FirebaseFirestoreService.createDocument(collectionPath, { ...transactionFrom, transferedTransactionID: docToRef.id }, docFromRef.id);

            const docUploadedFrom = await FirebaseFirestoreService.readDocumentRef(docFromRef) as ITransaction;
            const docUploadedTo = await FirebaseFirestoreService.readDocumentRef(docToRef) as ITransaction;

            // adding new doc to the transactions state (only if the doc is the same month as the current chosen by user)
            if (month.getMonth() === docUploadedFrom.date.getMonth()) {
              setTransactions(transactions => {
                return [docUploadedFrom, docUploadedTo, ...transactions];
              });
            }

            // adding new doc to the last added transactions state
            setRecentTransactions(transactions => {
              return [docUploadedFrom, docUploadedTo, ...transactions];
            });
          }
        }
        successToast('Transfer transaction added successfully!');

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useUpadateTransaction = () => {
  const [user] = useUser();
  const [transactions, setTransactions] = useTransactions();
  const [lastAddedTransactions, setLastAddedTransactions] = useLastAddedTransactions();

  return async (transaction: ITransaction, showAlert = true) => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/transactions`;

        const transactionWithoutID = { ...transaction };
        delete transactionWithoutID.id;
        await FirebaseFirestoreService.updateDocument(collectionPath, transactionWithoutID, transaction.id as string);

        const transactionsIndex = transactions.findIndex(item => item.id === transaction.id);
        if (transactionsIndex !== -1) {
          setTransactions(prev => {
            const newArray = [...prev];
            newArray[transactionsIndex] = transaction;
            return newArray;
          });
        }

        const lastAddedTransactionsIndex = lastAddedTransactions.findIndex(item => item.id === transaction.id);
        if (lastAddedTransactionsIndex !== -1) setLastAddedTransactions(prev => {
          const newArray = [...prev];
          newArray[lastAddedTransactionsIndex] = transaction;
          return newArray;
        });

        if (showAlert) successToast('Transaction updated successfully!');

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useDeleteTransaction = () => {
  const [user] = useUser();
  const [,setTransactions] = useTransactions();
  const [,setLastAddedTransactions] = useLastAddedTransactions();

  return async (transaction: ITransaction) => {
    const deleteConfirmation = window.confirm(`Are you sure you want to delete this ${transaction.type} transaction?\nOk for Yes. Cancel for No.${transaction.type === 'transfer' ? '\n\nThis action will delete both transactions related.' : ''}`);

    if (user && deleteConfirmation) {
      const collectionPath = `users/${user.uid}/transactions`;
      try {
        if (transaction.type === 'transfer') {
          await FirebaseFirestoreService.deleteDocument(collectionPath, transaction.id as string);
          await FirebaseFirestoreService.deleteDocument(collectionPath, transaction.transferedTransactionID);
        } else {
          await FirebaseFirestoreService.deleteDocument(collectionPath, transaction.id as string);
        }

        setTransactions(prev => {
          const newArray = [...prev];
          const fromIndex = newArray.findIndex(item => item.id === transaction.id);
          if (fromIndex !== -1) newArray.splice(fromIndex, 1);
          const transactionsToIndex = newArray.findIndex(item => item.id === transaction.transferedTransactionID);
          if (transactionsToIndex !== -1) newArray.splice(transactionsToIndex, 1);

          return newArray;
        });

        setLastAddedTransactions(prev => {
          const newArray = [...prev];
          const fromIndex = newArray.findIndex(item => item.id === transaction.id);
          if (fromIndex !== -1) newArray.splice(fromIndex, 1);
          const transactionsToIndex = newArray.findIndex(item => item.id === transaction.transferedTransactionID);
          if (transactionsToIndex !== -1) newArray.splice(transactionsToIndex, 1);

          return newArray;
        });
        successToast('Transaction deleted successfully!');

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};