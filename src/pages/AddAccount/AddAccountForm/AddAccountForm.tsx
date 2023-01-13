import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { IAccount, IAccountType } from 'assets/interfaces/interfaces';
import { useAccounts, useSelectedAccount, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddAccountForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import { isAccountNameValid } from './isAccountNameValid';
import { handleCreateDocFunction, handleFetchAccounts, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import classNames from 'classnames';


const AddAccountForm = () => {
  const nav = useNavigate();
  const [user] = useUser();
  const [accounts, setAccounts] = useAccounts();
  const [selectedAccount, setSelectedAccount] = useSelectedAccount();

  // 👇 useState form
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [initialBalance, setInitialBalance] = useState(0);
  const [numberSign, setNumberSign] = useState<'+' | '-'>('+');
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
      setNumberSign(editBalance >= 0 ? '+' : '-');
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
    const currency = numberSign === '+' ? '+ $' : '- $';

    const options = { minimumFractionDigits: 2 };
    const maskedNumber = currency + ' ' + (new Intl.NumberFormat('en-US', options).format(Math.abs(value))).toLocaleString().replace(/,/g, ' ');

    return maskedNumber;
  };

  const unmaskCurrencyNumber = (value: string) => {
    const valueOnlyNumbers = value.replace('.', '').replace(',', '').replace(/\D/g, '');
    const valueToFloat = parseFloat(valueOnlyNumbers) / 100;
    const finalValue = numberSign === '+' ? valueToFloat : - valueToFloat;
    setInitialBalance(finalValue);
  };

  const handleNumberSignClick = (input: '+' | '-') => {
    if (input === '+') {
      setNumberSign('+');
      setInitialBalance(Math.abs(initialBalance));
    } else {
      setNumberSign('-');
      setInitialBalance(-Math.abs(initialBalance));
    }
  };

  const handleNumberSignOnKeyUp = (key: string) => {
    if (key === '-') {
      handleNumberSignClick('-');
    } else if (key === '+') {
      handleNumberSignClick('+');
    }
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
          <div id='number-sing-options' role='select' className={styles.addAccountForm__numberSignOptions}>
            <div
              role='option'
              className={classNames({
                [styles.addAccountForm__numberSign]: true,
                [styles.addAccountForm__numberSignSelected]: numberSign === '+'
              })}
              onClick={() => handleNumberSignClick('+')}
            >+ $</div>
            <div
              role='option'
              className={classNames({
                [styles.addAccountForm__numberSign]: true,
                [styles.addAccountForm__numberSignSelected]: numberSign === '-'
              })}
              onClick={() => handleNumberSignClick('-')}
            >- $</div>
          </div>
          <input
            className={styles.addAccountForm__inputs}
            required
            type="text"
            onKeyUp={(e) => handleNumberSignOnKeyUp(e.key)}
            onChange={(e) => unmaskCurrencyNumber(e.target.value)}
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