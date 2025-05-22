import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

import { Layout, Typography, Button, Card, Row, Col, Alert, Space, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useCryptoContext } from '../context/crypto-context';
import { Line } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';

const { Content } = Layout;
const { Title } = Typography;

const contentStyle = {
  minHeight: 'calc(100vh - 60px)',
  padding: '24px',
  background: '#f5f5f5',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px',
};

const cardStyle = {
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  marginBottom: '24px',
};

export default function AnalyticsPage() {
    const { crypto, assets } = useCryptoContext();
    const prevMarketStatus = useRef(null);
    const [selectedRecommendedCoin, setSelectedRecommendedCoin] = useState(null);

    console.log('Crypto data in AnalyticsPage:', crypto);
    console.log('Assets data in AnalyticsPage:', assets);

    const sortedBy24h = [...crypto].sort((a, b) => (b.priceChange24h || 0) - (a.priceChange24h || 0));
    const topGainers = sortedBy24h.slice(0, 3);
    const topLosers = sortedBy24h.slice(-3).reverse();

    const total1hChange = crypto.reduce((sum, coin) => sum + (coin.priceChange1h || 0), 0);
    const average1hChange = crypto.length > 0 ? total1hChange / crypto.length : 0;

    let marketStatus = {
        text: 'Стабильный рынок',
        color: 'yellow',
        description: 'Незначительные изменения цен за последний час.'
    };

    if (average1hChange > 0.5) {
        marketStatus = {
            text: 'Бычий рынок',
            color: 'green',
            description: 'Значительный рост цен за последний час.'
        };
    } else if (average1hChange < -0.5) {
        marketStatus = {
            text: 'Медвежий рынок',
            color: 'red',
            description: 'Значительное падение цен за последний час.'
        };
    }

    const cryptoPriceMap = crypto.reduce((acc, coin) => {
        acc[coin.id] = Number(coin.price) || 0;
        return acc;
    }, {});

    const totalPortfolioValue = assets.reduce((total, asset) => {
        const coinPrice = cryptoPriceMap[asset.coinId] || 0;
        return total + (Number(asset.amount) * coinPrice);
    }, 0);

    // Расчет изменения стоимости портфеля за периоды
    const portfolioChange1h = assets.reduce((total, asset) => {
        const coin = crypto.find(c => c.id === asset.coinId);
        if (!coin || !coin.priceChange1h) return total;
        const currentAssetValue = Number(asset.amount) * (cryptoPriceMap[asset.coinId] || 0);
        return total + (currentAssetValue * (coin.priceChange1h / 100));
    }, 0);

    const portfolioChange24h = assets.reduce((total, asset) => {
        const coin = crypto.find(c => c.id === asset.coinId);
        if (!coin || !coin.priceChange24h) return total;
        const currentAssetValue = Number(asset.amount) * (cryptoPriceMap[asset.coinId] || 0);
        return total + (currentAssetValue * (coin.priceChange24h / 100));
    }, 0);

    const portfolioChange7d = assets.reduce((total, asset) => {
        const coin = crypto.find(c => c.id === asset.coinId);
        if (!coin || !coin.priceChange7d) return total;
        const currentAssetValue = Number(asset.amount) * (cryptoPriceMap[asset.coinId] || 0);
        return total + (currentAssetValue * (coin.priceChange7d / 100));
    }, 0);

    // Система рекомендаций: находим монеты с наименьшей волатильностью за 7 дней
    const sortedByVolatility = [...crypto].sort((a, b) => {
        const volatilityA = Math.abs(a.priceChange7d || 0);
        const volatilityB = Math.abs(b.priceChange7d || 0);
        return volatilityA - volatilityB;
    });

    const lowVolatilityCoins = sortedByVolatility.slice(0, 5); // Выбираем топ-5 наименее волатильных монет

    useEffect(() => {
        const currentStatus = marketStatus.text;
        
        if (prevMarketStatus.current !== null && prevMarketStatus.current !== currentStatus) {
            notification.info({
                message: 'Изменение состояния рынка',
                description: `Рынок изменился с "${prevMarketStatus.current}" на "${currentStatus}"`,
                duration: 4.5,
                placement: 'topRight',
            });
        }
        prevMarketStatus.current = currentStatus;
    }, [marketStatus.text]);

    return (
        <Content style={contentStyle}>
            <div style={headerStyle}>
                <Title level={2} style={{ margin: 0 }}>Аналитика портфеля</Title>
                <Space>
                    <Link to="/">
                        <Button type="primary">🏠 Главная</Button>
                    </Link>
                    <Link to="/taxes">
                        <Button type="primary">💰 Налоги</Button>
                    </Link>
                    <Link to="/info">
                        <Button type="primary">ℹ️ Информация</Button>
                    </Link>
                    <Link to="/portfolio-analysis">
                        <Button type="primary">🤖 AI Анализ</Button>
                    </Link>
                </Space>
            </div>

            <Card style={cardStyle}>
                <Title level={3}>Общая стоимость: {totalPortfolioValue.toFixed(2)} $</Title>
                <Typography.Paragraph>
                    Изменение за 1 час: <span style={{ color: portfolioChange1h >= 0 ? 'green' : 'red' }}>{portfolioChange1h.toFixed(2)} $</span>
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Изменение за 24 часа: <span style={{ color: portfolioChange24h >= 0 ? 'green' : 'red' }}>{portfolioChange24h.toFixed(2)} $</span>
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Изменение за 7 дней: <span style={{ color: portfolioChange7d >= 0 ? 'green' : 'red' }}>{portfolioChange7d.toFixed(2)} $</span>
                </Typography.Paragraph>
            </Card>

            {/* Состояние рынка (новый блок) */}
            <Card title="Общее состояние рынка" style={{ marginBottom: 32, borderColor: marketStatus.color, borderWidth: 2 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                    <Typography.Title level={3} style={{ color: marketStatus.color, margin: 0 }}>
                        {marketStatus.text}
                    </Typography.Title>
                    <Typography.Paragraph>
                        {marketStatus.description}
                    </Typography.Paragraph>
                    <Typography.Text strong>Среднее изменение за 1 час: {average1hChange.toFixed(2)}%</Typography.Text>
                </Space>
            </Card>

            {/* Волатильность и диверсификация (текст вместо графика) */}
            <Card title="Волатильность и диверсификация портфеля" style={{ marginBottom: 32 }}>
                {assets.length > 0 ? (
                    <Typography.Paragraph>
                        Ваш портфель содержит {assets.length} различных активов.
                        Детальная аналитика волатильности доступна в диаграммах ниже по каждой монете.
                    </Typography.Paragraph>
                ) : (
                    <Typography.Text>Добавьте ассеты в ваш портфель, чтобы увидеть анализ волатильности и диверсификации.</Typography.Text>
                )}
            </Card>

            {/* Анализ рынков */}
            <Card title="Анализ рынков" style={{ marginBottom: 32 }}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Typography.Title level={5}>Топ-3 по росту (24ч):</Typography.Title>
                        {topGainers.map(coin => (
                            <div key={coin.id} style={{ marginBottom: 8 }}>
                                <img src={coin.icon} alt={coin.name} style={{ width: 24, marginRight: 8 }} />
                                {coin.name}: <span style={{ color: 'green' }}>{coin.priceChange24h?.toFixed(2)}%</span>
                            </div>
                        ))}
                    </Col>
                    <Col xs={24} md={12}>
                        <Typography.Title level={5}>Топ-3 по падению (24ч):</Typography.Title>
                        {topLosers.map(coin => (
                            <div key={coin.id} style={{ marginBottom: 8 }}>
                                <img src={coin.icon} alt={coin.name} style={{ width: 24, marginRight: 8 }} />
                                {coin.name}: <span style={{ color: 'red' }}>{coin.priceChange24h?.toFixed(2)}%</span>
                            </div>
                        ))}
                    </Col>
                </Row>
            </Card>

            {/* Диаграммы Point Styling по каждой монете */}
            <Typography.Title level={4}>Динамика по каждой монете</Typography.Title>
            <Row gutter={[16, 16]}>
                {assets.map(asset => {
                    const coin = crypto.find(c => c.id === asset.coinId);
                    if (!coin) return null;

                    // Временно добавим вывод в консоль для отладки
                    console.log(`Data for ${coin.name}:`, {
                        priceChange1h: coin.priceChange1h,
                        priceChange1d: coin.priceChange1d,
                        priceChange1w: coin.priceChange1w
                    });

                    return (
                        <Col xs={24} sm={12} md={8} key={coin.id}>
                            <Card title={coin.name}>
                                {console.log(`Chart data for ${coin.name}:`, [
                                    coin.priceChange1h,
                                    coin.priceChange24h || 0,
                                    coin.priceChange7d || 0
                                ])}
                                <Line
                                    key={coin.id}
                                    data={{
                                        labels: ['1 час', '24 часа', '7 дней'],
                                        datasets: [{
                                            label: 'Изменение цены',
                                            data: [
                                                coin.priceChange1h,
                                                coin.priceChange24h || 0,
                                                coin.priceChange7d || 0
                                            ],
                                            borderColor: '#1890ff',
                                            backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                            tension: 0.4,
                                            fill: true
                                        }]
                                    }}
                                    options={{
                                        scales: { 
                                            y: { 
                                                title: { 
                                                    display: true, 
                                                    text: '%' 
                                                },
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 0.3
                                                }
                                            } 
                                        },
                                        plugins: { 
                                            legend: { display: false },
                                            tooltip: {
                                                callbacks: {
                                                    label: function(context) {
                                                        return `${context.raw.toFixed(2)}%`;
                                                    }
                                                }
                                            }
                                        },
                                        elements: {
                                            point: {
                                                radius: 4,
                                                hoverRadius: 6
                                            }
                                        }
                                    }}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Система рекомендаций */}
            <Card title="Рекомендации" style={{ marginTop: 32 }}>
                <Typography.Title level={5}>Монеты с наименьшей волатильностью за последние 7 дней:</Typography.Title>
                <Typography.Paragraph>
                    Монеты с низкой волатильностью могут быть интересны для снижения общего риска портфеля и улучшения его диверсификации, особенно для долгосрочных инвестиций. Выберите монету из списка, чтобы узнать подробнее:
                </Typography.Paragraph>
                {lowVolatilityCoins.length > 0 ? (
                    <ul>
                        {lowVolatilityCoins.map(coin => (
                            <li 
                                key={coin.id} 
                                style={{
                                    marginBottom: '8px', 
                                    cursor: 'pointer',
                                    fontWeight: selectedRecommendedCoin?.id === coin.id ? 'bold' : 'normal'
                                }}
                                onClick={() => setSelectedRecommendedCoin(coin)}
                            >
                                <img src={coin.icon} alt={coin.name} style={{ width: 20, marginRight: 8 }} />
                                {coin.name}: Изменение за 7 дней <span style={{ color: (coin.priceChange7d || 0) >= 0 ? 'green' : 'red' }}>{(coin.priceChange7d || 0).toFixed(2)}%</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography.Text>Недостаточно данных для предоставления рекомендаций по волатильности.</Typography.Text>
                )}

                {selectedRecommendedCoin && (
                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                        <Typography.Title level={5}>Подробнее о {selectedRecommendedCoin.name}:</Typography.Title>
                        <p>Изменение за 1 час: <span style={{ color: (selectedRecommendedCoin.priceChange1h || 0) >= 0 ? 'green' : 'red' }}>{(selectedRecommendedCoin.priceChange1h || 0).toFixed(2)}%</span></p>
                        <p>Изменение за 24 часа: <span style={{ color: (selectedRecommendedCoin.priceChange24h || 0) >= 0 ? 'green' : 'red' }}>{(selectedRecommendedCoin.priceChange24h || 0).toFixed(2)}%</span></p>
                        <p>Изменение за 7 дней: <span style={{ color: (selectedRecommendedCoin.priceChange7d || 0) >= 0 ? 'green' : 'red' }}>{(selectedRecommendedCoin.priceChange7d || 0).toFixed(2)}%</span></p>
                        <Typography.Paragraph style={{ marginTop: '10px' }}>
                            Добавление активов с низкой корреляцией и волатильностью, как {selectedRecommendedCoin.name}, может помочь снизить общий риск вашего портфеля. Однако всегда проводите собственный анализ перед инвестированием.
                        </Typography.Paragraph>
                    </div>
                )}
            </Card>
        </Content>
    );
} 