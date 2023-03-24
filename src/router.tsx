import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot, useRecoilSnapshot } from 'recoil';
import MenuST from 'components/MenuST/MenuST';
import Footer from 'components/Footer/Footer';
import ResetPassword from 'pages/AuthPages/ResetPassword/ResetPassword';
import PasswordReseted from 'pages/AuthPages/ResetPassword/PasswordReseted/PasswordReseted';
import Home from 'pages/Home/Home';
import TransactionsPage from 'pages/TransactionsPage/TransactionsPage';
import AddCategory from 'pages/AddCategory/AddCategory';
import Login from 'pages/AuthPages/Login/Login';
import Register from 'pages/AuthPages/Register/Register';
import AddAccount from 'pages/AddAccount/AddAccount';
import AddTransactionPage from 'pages/AddTransactionPage/AddTransactionPage';
import { useEffect } from 'react';

function DebugObserver() {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({isModified: true})) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

const Router = () => {
  return (
    <RecoilRoot>
      <DebugObserver />
      <BrowserRouter>
        <MenuST />
        <main>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/transactions' element={<TransactionsPage />} />
            <Route path='/newtransaction' element={<AddTransactionPage />} />
            <Route path='/newcategory' element={<AddCategory />} />
            <Route path='/newaccount' element={<AddAccount />} />
            <Route path='/register' element={<Register />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='/resetpassword/emailsent' element={<PasswordReseted />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default Router;
