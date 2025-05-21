import { Layout, Select, Space, Button, Modal, Drawer, Grid } from 'antd';
import { useCryptoContext } from '../../context/crypto-context';
import { useState, useEffect } from 'react';
import CoinInfoModel from './CoinInfoModel';
import AddAssetsForm from './AddAssetsForm';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../../services/users';

const { useBreakpoint } = Grid;

const headerStyle = {
  width: '100%', 
  textAlign: 'center',
  height: 60,
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export default function AppHeader() {
  const { crypto, userId } = useCryptoContext()
  const [select, setSelect] = useState(false);
  const [coin, setCoin ] = useState(null);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();

  useEffect(() => {
    const keypress = event => {
      if (event.key === '/') {
        setSelect((prev) => !prev);
      }
    };
    document.addEventListener('keypress', keypress);
    return () => document.removeEventListener('keypress', keypress);
  }, []);
   
  function handleChange(value) {
    const coin = crypto.find(coin => coin.id === value);
    setCoin(coin); 
    setModal(true);
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <Layout.Header style={headerStyle}>
      <Select 
        open={select}
        style={{ width: screens.md ? 250 : 120 }}
        value={screens.md ? "нажмите / для поиска" : "нажмите /"}
        onClick={() => setSelect((prev) => !prev)}
        onSelect={handleChange}
        optionLabelProp='label'
        options={crypto.map(coin => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img 
              src={option.data.icon} 
              alt={option.data.label} 
              style={{ width: '20px', height: '20px' }}
            /> 
            {option.data.label}
          </Space>
        )}
      />

      {screens.md && <h1 style={{ textAlign: 'center' }}><a href="/free-money">
      <img 
      src="./src/assets/logoErrX.png" 
      alt="Logo" 
      style={{ maxHeight: '40px', objectFit: 'contain' }} 
      />
      </a>
      </h1>}

      <Space size={screens.md ? "middle" : "small"}>
        <Link to="/analytics">
          <Button type="primary" size={screens.md ? "middle" : "small"}>
            {screens.md ? "📊 Аналитика" : "📊"}
          </Button>
        </Link>
        <Link to="/taxes">
          <Button type="primary" size={screens.md ? "middle" : "small"}>
            {screens.md ? "💰 Налоги" : "💰"}
          </Button>
        </Link>
        <Link to="/info">
          <Button type="primary" size={screens.md ? "middle" : "small"}>
            {screens.md ? "ℹ️ Информация" : "ℹ️"}
          </Button>
        </Link>
        <Button 
          type="primary" 
          onClick={() => setDrawer(true)}
          size={screens.md ? "middle" : "small"}
        >
          {screens.md ? "➕ Добавить актив" : "➕"}
        </Button>
        {userId && (
          <Button 
            type="default" 
            onClick={handleLogout}
            size={screens.md ? "middle" : "small"}
            danger
          >
            {screens.md ? "Выйти" : "X"}
          </Button>
        )}
      </Space>

      <Modal 
        open={modal} 
        onCancel={() => setModal(false)}
        footer={null}
      >   
        <CoinInfoModel coin={coin} />
      </Modal>

      <Drawer 
        width={screens.md ? '40%' : '100%'} 
        title="Добавить актив" 
        onClose={() => setDrawer(false)} 
        open={drawer} 
        destroyOnClose={true}
      >
        <AddAssetsForm onClose={() => setDrawer(false)} />
      </Drawer>
    </Layout.Header>
  )
}