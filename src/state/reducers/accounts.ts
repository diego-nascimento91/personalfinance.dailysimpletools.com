import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { useAccounts } from 'state/hooks/accounts';
import { useUser } from 'state/hooks/user';
import { successToast } from 'state/utils/toast';
import { IAccount, IOrderConfig } from 'utils/interfaces';


export const useFetchAccounts = () => {
  const [user] = useUser();
  const [, setAccounts] = useAccounts();

  return async () => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/accounts`;
        const orderConfig: IOrderConfig[] = [{ fieldName: 'name', orderDirection: 'asc' }];
        const accountsDB = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderConfig);
        setAccounts(accountsDB as IAccount[]);

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useAddNewAccount = () => {
  const [user] = useUser();
  const [, setAccounts] = useAccounts();

  return async (account: IAccount) => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/accounts`;
        const docRef = await FirebaseFirestoreService.createDocument(collectionPath, account);
        if (docRef) {
          const docUploaded = await FirebaseFirestoreService.readDocumentRef(docRef) as IAccount;

          // adding new doc to the accounts state
          setAccounts(accounts => {
            const newAccounts = [...accounts, docUploaded];
            newAccounts.sort((a, b) => {
              const nameA = a.name.toUpperCase(); // ignore upper and lowercase
              const nameB = b.name.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            return newAccounts;
          });
          successToast('Account added successfully!');
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

export const useUpadateAccount = () => {
  const [user] = useUser();
  const [accounts, setAccounts] = useAccounts();

  return async (account: IAccount) => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/accounts`;

        const accountWithoutID = { ...account };
        delete accountWithoutID.id;
        await FirebaseFirestoreService.updateDocument(collectionPath, accountWithoutID, account.id as string);

        const index = accounts.findIndex(item => item.id === account.id);
        if (index !== -1) {
          setAccounts(prev => {
            const newArray = [...prev];
            newArray[index] = account;
            return newArray;
          });
        }
        successToast('Account updated successfully!');

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useDeleteAccount = () => {
  const [user] = useUser();
  const [accounts, setAccounts] = useAccounts();

  return async (account: IAccount) => {
    const deleteConfirmation = window.confirm('Are you sure you want to delete this account?\nOk for Yes. Cancel for No.');

    if (user && deleteConfirmation) {
      const collectionPath = `users/${user.uid}/accounts`;
      try {
        await FirebaseFirestoreService.deleteDocument(collectionPath, account.id as string);

        const index = accounts.findIndex(item => item.id === account.id);
        if (index !== -1) {
          setAccounts(prev => {
            const newArray = [...prev];
            newArray.splice(index, 1);
            return newArray;
          });
        }
        successToast('Account deleted successfully!');

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};