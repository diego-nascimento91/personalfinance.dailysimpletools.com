import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { IAccount, IAccountType } from 'utils/interfaces';
import { useUser } from 'state/hooks/user';
import { isAccountNameValid } from './utils/isAccountNameValid';
import { useAccounts, useSelectedAccount_toBeEdited } from 'state/hooks/accounts';
import { useAddNewAccount, useUpadateAccount } from 'state/reducers/accounts';
import styles from './AddAccountForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import InputCurrency from 'components/InputCurrency/InputCurrency';


const AddAccountForm = () => {
  const nav = useNavigate();
  const [user] = useUser();
  const [accounts, ] = useAccounts();
  const [selectedAccount, setSelectedAccount] = useSelectedAccount_toBeEdited();

  // 👇 useState form
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [type, setType] = useState<IAccountType | ''>('');
  const [typeDescription, setTypeDescription] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [description, setDescription] = useState('');
  // ☝️ useState form

  const addNewAccount = useAddNewAccount();
  const updateAccount = useUpadateAccount();

  useEffect(() => {
    if (selectedAccount) handleSelectedAccountFormLoad();
  }, [selectedAccount]);

  useEffect(() => {
    setSelectedAccount(null);
    resetForm();
  }, []);


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
        updateAccount({...account, id: selectedAccount.id});
      } else {
        addNewAccount(account);
      }

      resetForm();
    }
  };

  const getAccountObj = () => {
    const accountObj: IAccount = {
      name: name,
      balance: type === 'balance-account' ? initialBalance : 0,
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

  const handleSetType = (value: string) => {

    if (value === '') {
      setTypeDescription('');
      return;
    }
    if (value === 'credit-account') {
      setTypeDescription('A credit card account will accept expenses and it will show the sum of all the expenses through each month. It may also receive an income transaction as a way of making a reverse transaction.');
    } else {
      setTypeDescription('This type of account accepts incomes and expenses that will be added to the account as deposits or withdraws. The balance will be upated after adding each transaction that uses this account.');
    }
    setType(value as IAccountType);
  };

  return (
    <section className={`${stylesComponents.pageComponents} ${styles.addAccountForm__container}`}>

      <div id='form-header'>
        <BsArrowLeft
          className={styles.addAccountForm__returnPage}
          role='button'
          onClick={handleReturnButton}
        />

        <div id='title'>
          {
            selectedAccount
              ? (
                <>
                  <h2>Edit Selected Account</h2>
                  <button className={styles.addAccountForm__cancelUpdate} onClick={resetForm}>Cancel Update Account</button>
                </>
              )
              : (
                <h2>Add a new Account</h2>
              )
          }
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <label className={styles.addAccountForm__labels}> How would you like to call this account?
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

        <label className={styles.addAccountForm__labels}> Type of account:
          <select
            className={styles.addAccountForm__selects}
            required
            value={type}
            onChange={(e) => handleSetType(e.target.value)}
          >
            <option value=""></option>
            <option value="credit-account">Credit Card</option>
            <option value="balance-account">Bank Account/ Debit Card/ Money</option>
          </select>
          <p className={styles.addAccountForm__typeDescription}>
            {
              typeDescription && typeDescription.length > 0
                ? (
                  typeDescription
                )
                : null
            }
          </p>
        </label>

        <div id='current-balance'>
          {
            type === 'balance-account'
              ? (
                <label className={styles.addAccountform__labels}> Current balance:
                  <InputCurrency setMoneyAmount={setInitialBalance} moneyAmount={initialBalance} />
                </label>
              )
              : null
          }
        </div>

        <label className={styles.addAccountForm__labels}> Description:
          <textarea
            className={styles.addAccountForm__textareas}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='(optional) write down any relevant notes about this account you may find useful.'
            style={{ 'width': '100%' }}
          />
        </label>

        <button className={styles.addAccountForm__button} type='submit'>
          {
            selectedAccount
              ? 'Update Account'
              : 'Add Account'
          }
        </button>
      </form>

    </section>
  );
};

export default AddAccountForm;