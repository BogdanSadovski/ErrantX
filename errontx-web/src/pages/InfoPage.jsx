import { Typography, Layout, Card, Row, Col, Button, Divider, Alert, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useCryptoContext } from '../context/crypto-context';

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

export default function InfoPage() {
    const { assets, crypto } = useCryptoContext();

    const cryptoPriceMap = crypto.reduce((acc, coin) => {
        acc[coin.id] = Number(coin.price) || 0;
        return acc;
    }, {});

    const totalPortfolioValue = assets.reduce((total, asset) => {
        const coinPrice = cryptoPriceMap[asset.coinId] || 0;
        return total + (Number(asset.amount) * coinPrice);
    }, 0);

    return (
        <Content style={contentStyle}>
            <div style={headerStyle}>
                <Title level={2} style={{ margin: 0 }}>Информация</Title>
                <Space>
                    <Link to="/">
                        <Button type="primary">🏠 Главная</Button>
                    </Link>
                    <Link to="/analytics">
                        <Button type="primary">📊 Аналитика</Button>
                    </Link>
                    <Link to="/taxes">
                        <Button type="primary">💰 Налоги</Button>
                    </Link>
                </Space>
            </div>

            <Card style={cardStyle}>
                <Title level={3}>Общая стоимость: {totalPortfolioValue.toFixed(2)} $</Title>
            </Card>

            <Typography.Title level={2}>О приложении Errant X</Typography.Title>

            <Alert
                message="Важное предупреждение"
                description="Errant X не является криптовалютной биржей или торговой платформой. Это информационное приложение, предназначенное для отслеживания и анализа криптовалютных активов. Все расчеты и аналитика предоставляются исключительно в ознакомительных целях."
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card title="О приложении">
                        <Typography.Paragraph>
                            Errant X - это современное приложение для управления криптовалютными активами, которое помогает пользователям:
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <ul>
                                <li>Отслеживать портфель криптовалют</li>
                                <li>Анализировать рыночные тренды</li>
                                <li>Получать рекомендации по диверсификации</li>
                                <li>Рассчитывать потенциальные налоговые обязательства</li>
                            </ul>
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            Версия: 1.0.0
                        </Typography.Paragraph>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Популярные криптовалютные биржи">
                        <Typography.Paragraph>
                            Для покупки и продажи криптовалюты рекомендуем использовать следующие проверенные биржи:
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <ul>
                                <li><a href="https://www.binance.com" target="_blank" rel="noopener noreferrer">Binance</a> - крупнейшая криптовалютная биржа</li>
                                <li><a href="https://www.bybit.com" target="_blank" rel="noopener noreferrer">Bybit</a> - популярная биржа с фокусом на деривативы</li>
                                <li><a href="https://www.kucoin.com" target="_blank" rel="noopener noreferrer">KuCoin</a> - биржа с широким выбором альткоинов</li>
                                <li><a href="https://www.huobi.com" target="_blank" rel="noopener noreferrer">Huobi</a> - надежная биржа с хорошей ликвидностью</li>
                            </ul>
                        </Typography.Paragraph>
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card title="Политика конфиденциальности">
                        <Typography.Paragraph>
                            Errant X уважает вашу конфиденциальность и стремится защитить ваши личные данные. Наша политика конфиденциальности включает:
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <ul>
                                <li>Сбор только необходимой информации для работы приложения</li>
                                <li>Безопасное хранение данных пользователей</li>
                                <li>Отсутствие передачи данных третьим лицам</li>
                                <li>Право пользователя на удаление своих данных</li>
                            </ul>
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            Мы не храним пароли от бирж или других сервисов. Все операции с криптовалютами пользователь совершает самостоятельно через официальные биржи.
                        </Typography.Paragraph>
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card title="Дисклеймер">
                        <Typography.Paragraph>
                            Используя приложение Errant X, вы соглашаетесь со следующими условиями:
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <ul>
                                <li>Приложение предоставляет информацию исключительно в ознакомительных целях</li>
                                <li>Мы не несем ответственности за любые финансовые решения, принятые на основе предоставленной информации</li>
                                <li>Криптовалютный рынок высоко волатилен, инвестиции сопряжены с риском</li>
                                <li>Рекомендуется проводить собственный анализ и консультироваться с финансовыми специалистами</li>
                            </ul>
                        </Typography.Paragraph>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
} 