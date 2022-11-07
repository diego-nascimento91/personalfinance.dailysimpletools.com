import 'assets/styles/theme.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import MenuST from 'components/MenuST/MenuST';
import Footer from 'components/Footer/Footer';
import ResetPassword from 'pages/AuthPages/ResetPassword/ResetPassword';
import PasswordReseted from 'pages/AuthPages/ResetPassword/PasswordReseted/PasswordReseted';
import Home from 'pages/Home/Home';
import TransactionsPage from 'pages/TransactionsPage/TransactionsPage';
import AddTransactionForm from 'pages/AddTransaction/AddTransaction';
import AddCategory from 'pages/AddCategory/AddCategory';
import Login from 'pages/AuthPages/Login/Login';
import Register from 'pages/AuthPages/Register/Register';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <MenuST />
        <main>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/transactions' element={<TransactionsPage />} />
            <Route path='/newtransaction' element={<AddTransactionForm />} />
            <Route path='/newcategory' element={<AddCategory />} />
            <Route path='/register' element={<Register />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='/resetpassword/emailsent' element={<PasswordReseted />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
