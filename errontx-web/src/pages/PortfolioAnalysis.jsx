import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message, Layout, Typography, Space, Card, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { useCryptoContext } from '../context/crypto-context';
import AiPortfolioAdvisor from '../components/AiPortfolioAdvisor';
import '../App.css';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

const contentStyle = {
  minHeight: 'calc(100vh - 60px)',
  padding: '24px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  flexWrap: 'wrap',
  gap: '16px',
  padding: '16px',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const formCardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
  padding: '24px',
  marginBottom: '24px',
  transition: 'transform 0.3s ease',
};

const buttonStyle = {
  borderRadius: '8px',
  height: '40px',
  padding: '0 24px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
};

const PortfolioAnalysis = () => {
  const [portfolioInput, setPortfolioInput] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [allCoins, setAllCoins] = useState([]);
  const [allCoinString, setAllCoinString] = useState('');

  const [form] = Form.useForm();
  const { assets } = useCryptoContext();

  useEffect(() => {
    const token = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log('=== Проверка токена OpenRouter ===');
    console.log('Токен существует:', !!token);
    if (token) {
      console.log('Длина токена:', token.length);
      console.log('Первые 10 символов токена:', token.substring(0, 10) + '...');
    } else {
      console.error('Токен не найден! Проверьте файл .env');
      console.error('Файл .env должен содержать: VITE_OPENROUTER_API_KEY=ваш_токен');
    }
    console.log('================================');
  }, []);

  useEffect(() => {
    const loadAllCoins = async () => {
      try {
        const coins = await fetchAllCoins();
        setAllCoins(coins);
      } catch (err) {
        console.error('Не удалось загрузить все монеты:', err);
      }
    };
    loadAllCoins();
  }, []);

  useEffect(() => {
    if (allCoins.length > 0) {
      const coinStr = allCoins
        .map(coin => `${coin.name} (${coin.symbol})`)
        .join(', ');
      setAllCoinString(coinStr);
    }
  }, [allCoins]);

  const handleFormChange = () => {
    setPortfolioInput(null);
    setPortfolioValue(null);
    setAnalysis(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const getAssetsString = () => {
    if (!assets || assets.length === 0) return '';
    return assets
      .filter(a => a.amount > 0)
      .map(a => `${a.name && a.name.length <= 6 ? a.name : a.coinId?.toUpperCase() || a.name}: ${a.amount}`)
      .join(', ');
  };

  const handleFillAssets = () => {
    const str = getAssetsString();
    if (str) {
      form.setFieldsValue({ portfolio: str });
      message.success('Ваши ассеты подставлены!');
    } else {
      message.warning('У вас нет ассетов для автозаполнения.');
    }
  };

  const handleSubmit = async (values) => {
    setError(null);
    setLoadingData(true);
    setPortfolioValue(null);
    setAnalysis(null);
    setIsAnalyzing(false);

    try {
      const portfolioObj = {};
      const pairs = values.portfolio.split(',').map(pair => pair.trim());
      
      pairs.forEach(pair => {
        const [coin, amount] = pair.split(':').map(item => item.trim());
        if (coin && amount) {
          portfolioObj[coin.toUpperCase()] = parseFloat(amount);
        }
      });

      if (Object.keys(portfolioObj).length === 0) {
        throw new Error('Портфель пуст или формат неверен. Используйте формат: BTC: 0.25, ETH: 1.5');
      }

      setPortfolioInput(portfolioObj);

      const prices = await fetchCryptoPrices();
      const { portfolioData, totalValue } = calculatePortfolioValue(portfolioObj, prices);
      
      if (Object.keys(portfolioData).length === 0) {
        throw new Error('Не удалось получить данные по введенным монетам из API.');
     }

      setPortfolioValue({ portfolioData, totalValue });

    } catch (error) {
      setError(error.message || 'Произошла ошибка при обработке портфеля');
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const coinSymbols = {
    'BITCOIN': 'BTC',
    'ETHEREUM': 'ETH',
    'BNB': 'BNB',
    'SOLANA': 'SOL',
    'TRON': 'TRX',
    'DOGECOIN': 'DOGE',
    'HEDERA': 'HBAR',
    'CHAINLINK': 'LINK',
    'USDT': 'USDT'
  };

  const fetchCryptoPrices = async () => {
    try {
      console.log('Начинаем запрос к API...');
      const response = await axios.get('https://openapiv1.coinstats.app/coins', {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': 'g3b2vIKB0g/Pnu9sM0nJy6FMlxEaUOv4rTmIlQ+AHLg='
        }
      });
      
      if (!response.data || !response.data.result || !Array.isArray(response.data.result)) {
        throw new Error('Неверный формат данных от API при получении цен');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Ошибка при получении цен из API:', error);
      throw error; 
    }
  };

  const calculatePortfolioValue = (portfolio, prices) => {
    if (!Array.isArray(prices)) {
      throw new Error('Неверный формат данных о ценах');
    }

    const portfolioData = {};
    let totalValue = 0;

    Object.entries(portfolio).forEach(([coin, amount]) => {
      const apiSymbol = coinSymbols[coin.toUpperCase()];
      if (!apiSymbol) {
        console.warn(`Нет маппинга для монеты ${coin}`);
        return;
      }
      
      const coinData = prices.find(c => c.symbol === apiSymbol);
      
      if (coinData) {
        const value = amount * coinData.price;
        portfolioData[coin] = {
          amount,
          value,
          price: coinData.price
        };
        totalValue += value;
      } else {
        console.warn(`Монета ${coin} (${apiSymbol}) не найдена в списке цен`);
      }
    });

    Object.keys(portfolioData).forEach(coin => {
      portfolioData[coin].percentage = (portfolioData[coin].value / totalValue) * 100;
    });

    return { portfolioData, totalValue };
  };

  const getAiAnalysis = async (portfolioData) => {
    try {
      const token = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!token) {
        throw new Error('Токен OpenRouter не найден');
      }

      const portfolioString = Object.entries(portfolioData)
        .map(([coin, data]) => `${coin}: ${data.percentage.toFixed(1)}%`)
        .join(', ');

      console.log('Отправляем запрос к OpenRouter API...');
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'Вы - эксперт по криптовалютным портфелям. Дайте краткий анализ портфеля и рекомендации по его оптимизации.'
            },
            {
              role: 'user',
              content: `Проанализируйте следующий криптовалютный портфель: ${portfolioString}. Дайте краткий \n              анализ распределения активов и рекомендации по оптимизации. \n              Ответ дай на русском используя проффесианальные термины. \n              Так же приводи примеры монет в которые столо вложить больше средств и те \n              которые стоит продать. Так же расскажи про монеты котторых нет но стоит купить.\n              Список всех монет: ${allCoinString}.\n              Уложи весь ответ в 2500 символов. `
            }
          ],
          temperature: 0.7,
          max_tokens: 2500
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Crypto Portfolio Analyzer'
          }
        }
      );

      if (!response.data || !response.data.choices || !response.data.choices[0]?.message?.content) {
        throw new Error('Неверный формат ответа от API');
      }

      const analysis = response.data.choices[0].message.content.trim();
      return `Портфель: ${portfolioString}\n\nАнализ:\n${analysis}`;
    } catch (error) {
      console.error('Детали ошибки:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      if (error.response?.status === 402) {
        return `Портфель: ${Object.entries(portfolioData)
          .map(([coin, data]) => `${coin}: ${data.percentage.toFixed(1)}%`)
          .join(', ')}\n\nАнализ:\nВ данный момент сервис анализа недоступен. Пожалуйста, попробуйте позже или обратитесь к администратору.`;
      }
      
      return `Портфель: ${Object.entries(portfolioData)
        .map(([coin, data]) => `${coin}: ${data.percentage.toFixed(1)}%`)
        .join(', ')}\n\nРекомендации:\n1. Регулярно ребалансируйте портфель\n2. Следите за новостями по вашим активам\n3. Рассмотрите диверсификацию портфеля`;
    }
  };

  const fetchAllCoins = async () => {
    try {
      const response = await axios.get('https://openapiv1.coinstats.app/coins', {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': 'g3b2vIKB0g/Pnu9sM0nJy6FMlxEaUOv4rTmIlQ+AHLg='
        }
      });
      
      if (!response.data || !response.data.result || !Array.isArray(response.data.result)) {
        throw new Error('Неверный формат данных от API при получении всех монет');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Ошибка при получении всех монет из API:', error);
      throw error;
    }
  };

  const handleAnalyzeClick = async () => {
    if (!portfolioValue) {
      message.warning('Сначала рассчитайте стоимость портфеля.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    try {
      const aiAnalysisResult = await getAiAnalysis(portfolioValue.portfolioData);
      setAnalysis(aiAnalysisResult);
    } catch (error) {
      setError(error.message || 'Произошла ошибка при анализе портфеля AI');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Content style={contentStyle}>
      <div style={headerStyle}>
        <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>AI Анализ Портфеля</Title>
        <Space size="middle">
          <Link to="/">
            <Button type="primary" style={buttonStyle}>🏠 Главная</Button>
          </Link>
          <Link to="/analytics">
            <Button type="primary" style={buttonStyle}>📊 Аналитика</Button>
          </Link>
          <Link to="/taxes">
            <Button type="primary" style={buttonStyle}>💰 Налоги</Button>
          </Link>
          <Link to="/info">
            <Button type="primary" style={buttonStyle}>ℹ️ Информация</Button>
          </Link>
        </Space>
      </div>
      
      <div className="analysis-container">
        <Card style={formCardStyle}>
          <Form
            form={form}
            onFinish={handleSubmit}
            onValuesChange={handleFormChange}
            layout="vertical"
            className="mb-8"
          >
            <Form.Item
              name="portfolio"
              label={<span style={{ fontSize: '16px', fontWeight: '500' }}>Введите ваш портфель</span>}
              rules={[{ required: true, message: 'Пожалуйста, введите данные портфеля' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="BTC: 0.25, ETH: 1.5, USDT: 1000"
                style={{
                  borderRadius: '8px',
                  fontSize: '16px',
                  padding: '12px',
                }}
              />
            </Form.Item>
            <Form.Item>
              <Space size="middle">
                <Button 
                  type="dashed" 
                  onClick={handleFillAssets} 
                  style={{
                    ...buttonStyle,
                    borderColor: '#1890ff',
                    color: '#1890ff',
                  }}
                >
                  Заполнить мои ассеты
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{
                    ...buttonStyle,
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                  }}
                  loading={loadingData}
                >
                  {loadingData ? 'Расчет...' : 'Рассчитать стоимость'}
                </Button>
                 {portfolioValue && (
                  <Button 
                    type="default" 
                    onClick={handleAnalyzeClick}
                    style={{
                      ...buttonStyle,
                      background: isAnalyzing ? '#e0e0e0' : 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
                      borderColor: isAnalyzing ? '#e0e0e0' : 'transparent',
                      color: 'white',
                    }}
                    loading={isAnalyzing}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <Space size="small">
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Анализируем...</span>
                      </Space>
                    ) : (
                      'Показать AI анализ'
                    )}
                  </Button>
                 )}
              </Space>
            </Form.Item>
             {error && (
              <Alert
                message="Ошибка"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: '24px' }}
              />
            )}
          </Form>
        </Card>

        {portfolioValue && (
          <AiPortfolioAdvisor portfolioValue={portfolioValue} analysis={analysis} loading={loadingData || isAnalyzing} error={error} />
        )}
      </div>
    </Content>
  );
};

export default PortfolioAnalysis; 