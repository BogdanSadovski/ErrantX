import { Typography, Layout, Card, Row, Col, Form, InputNumber, Button, Divider, Alert, Space } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCryptoContext } from '../context/crypto-context';
import { fetchExchangeRates } from '../services/exchangeRateService';

const { Content } = Layout;
const { Title } = Typography;

// Начальные значения курсов (будут обновлены через API)
const initialRates = {
    USDT_TO_RUB_RATE: 80.15,
    USDT_TO_BYN_RATE: 3.26,
    USDT_TO_USD_RATE: 1.00,
    USDT_TO_EUR_RATE: 0.92,
    USDT_TO_GBP_RATE: 0.79,
    USDT_TO_CNY_RATE: 7.23,
    USDT_TO_PLN_RATE: 3.95,
    USDT_TO_KZT_RATE: 450.50
};

const currencyEmojis = {
    RUB: '₽',
    BYN: 'Br',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CNY: '¥',
    PLN: 'zł',
    KZT: '₸'
};

const currencyFlagEmojis = {
    RUB: '🇷🇺',
    BYN: '🇧🇾',
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    CNY: '🇨🇳',
    PLN: '🇵🇱',
    KZT: '🇰🇿'
};

const currencyNames = {
    RUB: 'Российский рубль',
    BYN: 'Белорусский рубль',
    USD: 'Доллар США',
    EUR: 'Евро',
    GBP: 'Фунт стерлингов',
    CNY: 'Китайский юань',
    PLN: 'Польский злотый',
    KZT: 'Казахстанский тенге'
};

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

export default function TaxesPage() {
    const { assets, crypto } = useCryptoContext();
    const [rfForm] = Form.useForm();
    const [rbForm] = Form.useForm();
    const [rfTaxResult, setRfTaxResult] = useState(null);
    const [rbTaxResult, setRbTaxResult] = useState(null);
    const [exchangeRates, setExchangeRates] = useState(initialRates);
    const [isLoading, setIsLoading] = useState(true);

    const cryptoPriceMap = crypto.reduce((acc, coin) => {
        acc[coin.id] = Number(coin.price) || 0;
        return acc;
    }, {});

    const totalPortfolioValue = assets.reduce((total, asset) => {
        const coinPrice = cryptoPriceMap[asset.coinId] || 0;
        return total + (Number(asset.amount) * coinPrice);
    }, 0);

    useEffect(() => {
        // Устанавливаем начальные значения для обеих форм
        rfForm.setFieldsValue({ profitUSDT: totalPortfolioValue });
        rbForm.setFieldsValue({ profitUSDT: totalPortfolioValue });
    }, [totalPortfolioValue, rfForm, rbForm]);

    // Получение курсов валют при монтировании компонента
    useEffect(() => {
        const getRates = async () => {
            try {
                const rates = await fetchExchangeRates();
                setExchangeRates({
                    USDT_TO_RUB_RATE: rates.RUB,
                    USDT_TO_BYN_RATE: rates.BYN,
                    USDT_TO_USD_RATE: rates.USD || 1.00,
                    USDT_TO_EUR_RATE: rates.EUR || 0.92,
                    USDT_TO_GBP_RATE: rates.GBP || 0.79,
                    USDT_TO_CNY_RATE: rates.CNY || 7.23,
                    USDT_TO_PLN_RATE: rates.PLN || 3.95,
                    USDT_TO_KZT_RATE: rates.KZT || 450.50
                });
            } catch (error) {
                console.error('Ошибка при получении курсов:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getRates();
        // Обновляем курсы каждые 5 минут
        const interval = setInterval(getRates, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Расчет налога РФ (упрощенно: 13% или 15% НДФЛ)
    const calculateRfTax = (profitUSDT) => {
        if (profitUSDT === undefined || profitUSDT === null) return null;
        const profitRUB = profitUSDT * exchangeRates.USDT_TO_RUB_RATE;
        const taxRate = profitRUB > 2400000 ? 0.15 : 0.13;
        const taxRUB = profitRUB * taxRate;
        const remainingRUB = profitRUB - taxRUB;
        const remainingUSDT = remainingRUB / exchangeRates.USDT_TO_RUB_RATE;
        return {
            taxRUB: taxRUB.toFixed(2),
            remainingRUB: remainingRUB.toFixed(2),
            profitRUB: profitRUB.toFixed(2),
            profitUSDT: profitUSDT.toFixed(2),
            remainingUSDT: remainingUSDT.toFixed(2),
            taxRate: (taxRate * 100).toFixed(0),
            isHighIncome: profitRUB > 2400000
        };
    };

    const onFinishRf = (values) => {
        setRfTaxResult(calculateRfTax(values.profitUSDT));
    };

    // Расчет налога РБ (упрощенно: 13% подоходный налог)
    const calculateRbTax = (profitUSDT) => {
        if (profitUSDT === undefined || profitUSDT === null) return null;
        const profitBYN = profitUSDT * exchangeRates.USDT_TO_BYN_RATE;
        const taxBYN = profitBYN * 0.13;
        const remainingBYN = profitBYN - taxBYN;
        const remainingUSDT = remainingBYN / exchangeRates.USDT_TO_BYN_RATE;
        return {
            taxBYN: taxBYN.toFixed(2),
            remainingBYN: remainingBYN.toFixed(2),
            profitBYN: profitBYN.toFixed(2),
            profitUSDT: profitUSDT.toFixed(2),
            remainingUSDT: remainingUSDT.toFixed(2)
        };
    };

    const onFinishRb = (values) => {
        setRbTaxResult(calculateRbTax(values.profitUSDT));
    };

    return (
        <Content style={contentStyle}>
            <div style={headerStyle}>
                <Title level={2} style={{ margin: 0 }}>Налоговая аналитика</Title>
                <Space>
                    <Link to="/">
                        <Button type="primary">🏠 Главная</Button>
                    </Link>
                    <Link to="/analytics">
                        <Button type="primary">📊 Аналитика</Button>
                    </Link>
                    <Link to="/info">
                        <Button type="primary">ℹ️ Информация</Button>
                    </Link>
                    <Link to="/portfolio-analysis">
                        <Button type="primary">🤖 AI Анализ</Button>
                    </Link>
                </Space>
            </div>

            {isLoading ? (
                <Alert
                    message="Загрузка курсов валют..."
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            ) : (
                <Card style={cardStyle}>
                    <Title level={4} style={{ marginBottom: 16 }}>Текущие курсы валют к USDT</Title>
                    <Row gutter={[16, 16]}>
                        {Object.entries({
                            RUB: exchangeRates.USDT_TO_RUB_RATE,
                            BYN: exchangeRates.USDT_TO_BYN_RATE,
                            USD: exchangeRates.USDT_TO_USD_RATE,
                            EUR: exchangeRates.USDT_TO_EUR_RATE,
                            GBP: exchangeRates.USDT_TO_GBP_RATE,
                            CNY: exchangeRates.USDT_TO_CNY_RATE,
                            PLN: exchangeRates.USDT_TO_PLN_RATE,
                            KZT: exchangeRates.USDT_TO_KZT_RATE
                        }).map(([currency, rate]) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={currency}>
                                <Card size="small" style={{ textAlign: 'center' }}>
                                    <Typography.Title level={5} style={{ margin: 0 }}>
                                        {currencyFlagEmojis[currency]} {currency}
                                    </Typography.Title>
                                    <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                        {currencyNames[currency]}
                                    </Typography.Text>
                                    <Typography.Text strong style={{ fontSize: '1.2em' }}>
                                        1 USDT = {rate.toFixed(2)} {currencyEmojis[currency]}
                                    </Typography.Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}

            <Card style={cardStyle}>
                <Title level={3}>Общая стоимость: {totalPortfolioValue.toFixed(2)} $</Title>
            </Card>

            <Alert
                message="Внимание: Представленная информация и калькуляторы являются ознакомительными и упрощенными. Налоговое законодательство может меняться, а фактический расчет налога зависит от множества индивидуальных факторов (документально подтвержденные расходы, общий доход, статус налогоплательщика и т.д.). Для точного расчета налога рекомендуем обратиться к квалифицированному налоговому консультанту." // Disclaimer
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Row gutter={[24, 24]}>
                {/* Секция РФ */}
                <Col xs={24} md={12}>
                    <Card title="Налогообложение в Российской Федерации (РФ)">
                        <Typography.Paragraph>
                            С точки зрения российского законодательства, криптовалюта рассматривается как имущество. Доход, полученный от операций с криптовалютой (например, от продажи), облагается налогом на доходы физических лиц (НДФЛ).
                        </Typography.Paragraph>
                         <Typography.Paragraph strong>
                           Основные моменты для физических лиц:
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <ul>
                                <li>Ставка НДФЛ составляет 13% для большинства налоговых резидентов РФ с годовым доходом до 2.4 млн ₽. При превышении этого порога применяются повышенные ставки (15% и выше).</li>
                                <li>Налог уплачивается с финансового результата (прибыли): разницы между доходом от продажи и документально подтвержденными расходами на приобретение.</li>
                                <li>Доходы необходимо декларировать самостоятельно путем подачи декларации 3-НДФЛ.</li>
                                 <li>Необходимо хранить документы, подтверждающие операции (банковские выписки, выписки бирж и т.д.).</li>
                            </ul>
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            Более подробную информацию и актуальные изменения можно найти в Федеральном законе № 259-ФЗ, Налоговом кодексе РФ и разъяснениях Минфина/ФНС. Примерные ссылки:
                             <ul>
                                <li><a href="https://konsol.pro/blog/kriptovaluta-i-nalogi" target="_blank" rel="noopener noreferrer">Криптовалюта и налоги: правила для ИП, физлиц и компаний на 2025 год (konsol.pro)</a></li>
                                 <li><a href="https://www.gazprombank.ru/pro-finance/innovation/nalog-na-tsifrovuyu-valyutu/" target="_blank" rel="noopener noreferrer">Какой налог нужно будет платить на цифровую валюту в 2025 году (gazprombank.ru)</a></li>
                                 <li><a href="https://pravo.ru/news/256452/" target="_blank" rel="noopener noreferrer">Путин подписал закон о налогообложении криптовалюты (pravo.ru)</a></li>
                            </ul>
                        </Typography.Paragraph>

                        <Divider />

                         <Typography.Title level={4}>Калькулятор налога РФ (упрощенный)</Typography.Title>
                        <Form
                            form={rfForm}
                            name="rf_tax_calc"
                            onFinish={onFinishRf}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Прибыль в USDT"
                                name="profitUSDT"
                                rules={[{ required: true, message: 'Пожалуйста, введите сумму прибыли!' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Введите сумму" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Расчитать</Button>
                            </Form.Item>
                        </Form>

                        {rfTaxResult && (
                            <div style={{ marginTop: 16 }}>
                                <Typography.Text strong>Прибыль в RUB (приблизительно):</Typography.Text> {rfTaxResult.profitRUB} ₽<br/>
                                <Typography.Text strong>Прибыль в USDT:</Typography.Text> {rfTaxResult.profitUSDT} USDT<br/>
                                <Typography.Text strong>Примерный налог ({rfTaxResult.taxRate}%):</Typography.Text> {rfTaxResult.taxRUB} ₽<br/>
                                <Typography.Text strong>Остаток после уплаты налога:</Typography.Text> {rfTaxResult.remainingRUB} ₽ ({rfTaxResult.remainingUSDT} USDT)
                                {rfTaxResult.isHighIncome && (
                                    <Alert
                                        message="Внимание: При доходе свыше 2.4 млн ₽ применяется минимальная ставка 15%. Фактическая ставка может быть выше в зависимости от общего годового дохода."
                                        type="warning"
                                        showIcon
                                        style={{ marginTop: 16 }}
                                    />
                                )}
                            </div>
                        )}

                    </Card>
                </Col>

                {/* Секция РБ */}
                <Col xs={24} md={12}>
                    <Card title="Налогообложение в Республике Беларусь (РБ)">
                        <Typography.Paragraph>
                           С 1 января 2025 года доходы физических лиц от разрешенных операций с криптовалютой, полученные от зарубежных торговых площадок, иностранных организаций, ИП и иных физических лиц, облагаются подоходным налогом.
                        </Typography.Paragraph>
                         <Typography.Paragraph strong>
                           Основные моменты для физических лиц:
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <ul>
                                <li>Ставка подоходного налога составляет 13%.</li>
                                <li>Налоговая база для доходов от зарубежных площадок определяется как сумма средств, фактически выведенных с площадки. Расходы на приобретение токенов не учитываются.</li>
                                <li>При сокрытии доходов или несвоевременной уплате может применяться повышенная ставка 26%.</li>
                                <li>Некоторые операции освобождены от налога (через резидентов ПВТ, майнинг, обмен токенов на токены, наследство, некоторые случаи дарения).</li>
                            </ul>
                        </Typography.Paragraph>
                         <Typography.Paragraph>
                            Более подробную информацию и актуальные изменения можно найти в Налоговом кодексе РБ, Декрете № 8 и разъяснениях Министерства по налогам и сборам. Примерные ссылки:
                             <ul>
                                <li><a href="https://nalog.gov.by/news/29735/" target="_blank" rel="noopener noreferrer">Что нужно знать при осуществлении операций с криптовалютой (nalog.gov.by)</a></li>
                                 <li><a href="https://www.alfabank.by/about/articles/bud-smelee/s-2025-goda-vvoditsya-nalog-na-dokhody-ot-kripty-dlya-fizlits-chto-nuzhno-znat/" target="_blank" rel="noopener noreferrer">С 2025 года вводится налог на доходы от крипты для физлиц. Что нужно знать (alfabank.by)</a></li>
                                  <li><a href="https://myfin.by/article/blogi/nalogooblozenie-operacij-s-kriptovalutoj-cto-nuzno-znat-fiziceskim-i-uridiceskim-licam-36274" target="_blank" rel="noopener noreferrer">Налогообложение операций с криптовалютой: что нужно знать физическим и юридическим лицам в 2025-м (myfin.by)</a></li>
                            </ul>
                        </Typography.Paragraph>

                        <Divider />

                         <Typography.Title level={4}>Калькулятор налога РБ (упрощенный)</Typography.Title>
                         <Form
                            form={rbForm}
                            name="rb_tax_calc"
                            onFinish={onFinishRb}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Прибыль в USDT"
                                name="profitUSDT"
                                rules={[{ required: true, message: 'Пожалуйста, введите сумму прибыли!' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Введите сумму" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Расчитать</Button>
                            </Form.Item>
                        </Form>

                         {rbTaxResult && (
                            <div style={{ marginTop: 16 }}>
                                <Typography.Text strong>Прибыль в BYN (приблизительно):</Typography.Text> {rbTaxResult.profitBYN} BYN<br/>
                                <Typography.Text strong>Прибыль в USDT:</Typography.Text> {rbTaxResult.profitUSDT} USDT<br/>
                                <Typography.Text strong>Примерный налог (13%):</Typography.Text> {rbTaxResult.taxBYN} BYN<br/>
                                <Typography.Text strong>Остаток после уплаты налога:</Typography.Text> {rbTaxResult.remainingBYN} BYN ({rbTaxResult.remainingUSDT} USDT)
                            </div>
                        )}

                    </Card>
                </Col>
            </Row>
        </Content>
    );
} 