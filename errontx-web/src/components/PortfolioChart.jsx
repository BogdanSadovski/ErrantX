import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useCryptoContext } from '../context/crypto-context';
import { Typography, Button, Space, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import AddAssetsForm from './layout/AddAssetsForm';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart() {
    const { assets, crypto } = useCryptoContext();
    const [drawer, setDrawer] = useState(false);

    if (assets.length === 0) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '500px',
                textAlign: 'center',
                padding: '20px'
            }}>
                <Typography.Title level={3}>
                    У вас пока нет активов
                </Typography.Title>
                <Typography.Paragraph style={{ marginBottom: '20px' }}>
                    Добавьте свои первые активы, чтобы начать отслеживать свой портфель
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: '20px' }}>
                    Нажмите "/" чтобы изучить список доступных монет
                </Typography.Paragraph>
                <Space>
                    <Link to="/info">
                        <Button type="primary">
                            Узнать больше
                        </Button>
                    </Link>
                    <Button 
                        type="primary" 
                        onClick={() => setDrawer(true)}
                    >
                        Добавить актив
                    </Button>
                </Space>

                <Drawer 
                    width="40%" 
                    title="Добавить актив" 
                    onClose={() => setDrawer(false)} 
                    open={drawer} 
                    destroyOnClose={true}
                >
                    <AddAssetsForm onClose={() => setDrawer(false)} />
                </Drawer>
            </div>
        );
    }

    // Создаем карту цен криптовалют
    const cryptoPriceMap = crypto.reduce((acc, coin) => {
        acc[coin.id] = Number(coin.price) || 0;
        return acc;
    }, {});

    // Рассчитываем значения для диаграммы
    const chartData = {
        labels: assets.map(asset => asset.name),
        datasets: [{
            label: 'Стоимость портфеля ($)',
            data: assets.map(asset => {
                const coinPrice = cryptoPriceMap[asset.coinId] || 0;
                return Number(asset.amount) * coinPrice;
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            marginBottom: '1rem',
            justifyContent: 'center', 
            height: '500px' 
        }}>
            <Pie data={chartData} options={options} />
        </div>
    );
} 