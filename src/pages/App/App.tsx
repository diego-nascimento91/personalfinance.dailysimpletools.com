import Footer from 'components/Footer/Footer';
import MenuST from 'components/MenuST/MenuST';
import Login from 'pages/Login/Login';
import Home from 'pages/Home/Home';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'assets/styles/theme.scss';
import ResetPassword from 'pages/ResetPassword/ResetPassword';
import Register from 'pages/Register/Register';
import PasswordReseted from 'pages/ResetPassword/PasswordReseted/PasswordReseted';
import TransactionsPage from 'pages/TransactionsPage/TransactionsPage';

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
