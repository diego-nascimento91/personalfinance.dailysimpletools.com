import Footer from 'components/Footer/Footer';
import MenuST from 'components/MenuST/MenuST';
import { RecoilRoot } from 'recoil';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <MenuST />
      <div className='container'>Project</div>
      <Footer />
    </RecoilRoot>
  );
}

export default App;
