import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
// import { handleCreateDocFunction, handleFetchCategories, handleFetchOnlyUserCategories, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { IAccount, IAccountType } from 'assets/interfaces/interfaces';
import { useAccounts, useSelectedAccount, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddAccountForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import { isAccountNameValid } from './isAccountNameValid';
import { handleCreateDocFunction, handleFetchAccounts, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';


const AddAccountForm = () => {
  const nav = useNavigate();
  const [user] = useUser();
  const [accounts, setAccounts] = useAccounts();
  const [selectedAccount, setSelectedAccount] = useSelectedAccount();

  // 👇 useState form
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [initialBalance, setInitialBalance] = useState(0);
  const [type, setType] = useState<IAccountType | ''>('');
  const [description, setDescription] = useState('');
  // ☝️ useState form

  useEffect(() => {
    if (selectedAccount) handleSelectedAccountFormLoad();
  }, [selectedAccount]);

  const handleSelectedAccountFormLoad = () => {
    if (selectedAccount) {
      const editName = selectedAccount.name;
      const editBalance = selectedAccount.balance;
      const editType = selectedAccount.type;
      const editDescription = selectedAccount.description;
      setName(editName);
      setInitialBalance(editBalance);
      setType(editType);
      setDescription(editDescription);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAccountNameValid(name, accounts, selectedAccount)) {
      setIsNameValid(false);
      return;
    }

    if (user) {
      const account = getAccountObj();
      if (selectedAccount) {
        await handleUpdateDocFunction('accounts', user.uid, { ...account, id: selectedAccount.id });
      } else {
        await handleCreateDocFunction('accounts', user.uid, account);
      }

      handleFetchAccounts(setAccounts, user.uid);
      resetForm();
    }
  };

  const getAccountObj = () => {
    const accountObj: IAccount = {
      name: name,
      balance: initialBalance,
      type: type as IAccountType,
      description: description,
    };

    return accountObj;
  };

  const resetForm = () => {
    setName('');
    setInitialBalance(0);
    setType('');
    setDescription('');
    setSelectedAccount(null);
  };

  const handleReturnButton = () => {
    // setSelectedAccount(null);
    if (window.history.state && window.history.state.idx > 0) {
      nav(-1);
    } else {
      nav('/', { replace: true }); // return to home if there is no back page history
    }
  };

  const maskCurrencyNumber = (value: number) => {
    const options = { minimumFractionDigits: 2 };
    const maskedNumber = (new Intl.NumberFormat('en-US', options).format(value)).toLocaleString().replace(/,/g, ' ');

    return '$ ' + maskedNumber;
  };

  const unmaskCurrencyNumber = (value: string) => {
    value = value.replace('.', '').replace(',', '').replace(/\D/g, '');
    return parseFloat(value) / 100;
  };

  return (
    <section className={`${stylesComponents.pageComponents} ${styles.addAccountForm__container}`}>

      <BsArrowLeft
        className={styles.addAccountForm__returnPage}
        role='button'
        onClick={handleReturnButton}
      />
      <h2>Add a new Account</h2>

      <form onSubmit={handleFormSubmit}>
        <label className={styles.addAccountForm__labels}>
          How would you like to call this account?
          <input
            className={styles.addAccountForm__inputs}
            required
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setIsNameValid(true); }}
          />
          {
            !isNameValid && <span className={styles.addAccountForm__accountErrorMsg} role='alert'>This account&apos;s name already exists. Please choose another name.</span>
          }
        </label>

        <label className={styles.addAccountform__labels}>
          Current balance:
          <input
            className={`${styles.addAccountForm__inputs} ${styles.addAccountform__currencyInput}`}
            required
            type="text"
            onChange={(e) => setInitialBalance(unmaskCurrencyNumber(e.target.value))}
            value={maskCurrencyNumber(initialBalance)}
            placeholder='0.00'
          />
        </label>

        <label className={styles.addAccountForm__labels}>
          Type of account:
          <select
            className={styles.addAccountForm__selects}
            required
            value={type}
            onChange={(e) => setType(e.target.value as IAccountType)}
          >
            <option value=""></option>
            <option value="creditcard">Credit Card</option>
            <option value="money">Money</option>
            <option value="bankaccount">Bank Account</option>
            <option value="debitcard">Debit Card</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className={styles.addAccountForm__labels}>
          Description:
          <textarea
            className={styles.addAccountForm__textareas}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='(optional) write down any relevant notes about this account you may find useful.'
            style={{ 'width': '100%' }}
          />
        </label>

        <button className={styles.addAccountForm__button} type='submit'>
          Add new account
        </button>
      </form>

    </section>
  );
};

export default AddAccountForm;