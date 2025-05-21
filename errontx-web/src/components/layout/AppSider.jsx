import { Layout, Card, Statistic, List, Typography, Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined } from '@ant-design/icons';
import { capitalize } from '../../utils';
import { useContext, useState } from 'react';
import CryptoContext from '../../context/crypto-context';

const siderStyle = {
  padding: '1rem',
  height: '100%',
  maxHeight: 'calc(100vh - 64px)', // 64px — высота header
  overflowY: 'auto',
  background: '#fff',
};

export default function AppSider() {
    const { assets, crypto, removeAsset } = useContext(CryptoContext);
    const [hoveredId, setHoveredId] = useState(null);

    const formatNumber = (value) => {
        if (typeof value !== 'number') return '0.00';
        return value.toFixed(2);
    };

    // Создаем карту цен криптовалют
    const cryptoPriceMap = crypto.reduce((acc, coin) => {
        acc[coin.id] = Number(coin.price) || 0;
        return acc;
    }, {});

    return (
        <Layout.Sider width="25%" style={siderStyle}> 
        <div style={{height: '100%', overflowY: 'auto', paddingRight: 8}}>
        {assets.map(asset => {
            const coinPrice = cryptoPriceMap[asset.coinId] || 0;
            const totalAmount = Number(asset.amount) * coinPrice;
            const totalProfit = totalAmount - (Number(asset.amount) * Number(asset.price));
            const grow = Number(asset.price) < coinPrice;
            const growPercent = ((coinPrice - Number(asset.price)) / Number(asset.price) * 100);

            return (
                <div
                    key={asset.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredId(asset.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    {hoveredId === asset.id && (
                        <CloseOutlined
                            onClick={() => removeAsset(asset.id)}
                            style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                fontSize: 18,
                                color: '#cf1322',
                                zIndex: 2,
                                cursor: 'pointer',
                                background: 'white',
                                borderRadius: '50%',
                                padding: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    )}
                    <Card style={{ marginBottom: '1rem' }}>
                <Statistic  
                        title={asset.name ? capitalize(asset.name) : 'Неизвестный актив'}
                        value={totalAmount}
                precision={2}
                        valueStyle={{ color: grow ? '#3f8600' : '#cf1322' }}
                        prefix={grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="$"/> 
                <List
                size="small"
                dataSource={
                    [
                                {title: 'Общая прибыль', value: totalProfit, withTag: true}, 
                        {title: 'Количество', value: asset.amount, isPlain: true},
                    ]
                }
                renderItem={(item) => (
                    <List.Item>
                    <span>{item.title}</span>
                    <span>
                             {item.withTag && <Tag color={grow ? 'green' : 'red'}>{formatNumber(growPercent)}%</Tag>}
                            {item.isPlain && formatNumber(item.value)}
                            {!item.isPlain && <Typography.Text type={grow ? 'success' : 'danger'}> 
                                {formatNumber(item.value)}$ </Typography.Text>}
                    </span>
                    </List.Item>
                )}
                />
            </Card> 
                </div>
            );
        })}
        </div>
        </Layout.Sider>
    );
}