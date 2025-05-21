import { Layout, Spin, Grid } from 'antd';
import AppHeader from './AppHeader';
import AppSider from './AppSider';
import AppContent from './AppContent';
import { useContext } from 'react';
import CryptoContext from '../../context/crypto-context';

const { useBreakpoint } = Grid;

export default function AppLayout(){
    const { loading } = useContext(CryptoContext);
    const screens = useBreakpoint();
    
    if(loading) {
        return <Spin fullscreen />
    }
    
    return(
        <Layout style={{ minHeight: '100vh' }}>
            <AppHeader/>
            <Layout style={{ background: '#fff' }}>
                {screens.md && <AppSider />}
                <Layout style={{ 
                    marginLeft: screens.md ? '200px' : 0,
                    background: '#fff',
                    padding: '24px'
                }}>
                    <AppContent />
                </Layout>
            </Layout>
        </Layout>
    )
}