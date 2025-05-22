import React from 'react';
import { Card, Typography, Space, Progress, Alert } from 'antd';

const { Title, Text } = Typography;

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
  marginBottom: '24px',
  transition: 'transform 0.3s ease',
};

const metricCardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  height: '100%',
};

const AiPortfolioAdvisor = ({ portfolioValue, analysis, loading, error }) => {

  if (loading && !analysis) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <Text style={{ fontSize: '16px', color: '#666' }}>Загрузка данных портфеля...</Text>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <Alert
        message="Ошибка"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: '24px' }}
      />
    );
  }

  if (!portfolioValue && !loading && !error) {
    return (
        <Alert
        message="Введите данные портфеля"
        description="Пожалуйста, введите данные вашего портфеля в форме выше и нажмите 'Рассчитать стоимость'."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {portfolioValue && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-8">
              <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>Структура портфеля</Title>
               {/* Кнопка AI анализа перенесена в PortfolioAnalysis */}
            </div>
            
            <Card style={cardStyle} className="mb-8">
              <div className="text-center mb-6">
                <Title level={3} style={{ color: '#1a1a1a', marginBottom: '8px' }}>Общая стоимость портфеля</Title>
                <Text style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1890ff' }}>
                  ${portfolioValue.totalValue.toFixed(2)}
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card style={metricCardStyle}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>Количество активов</Text>
                  <Title level={4} style={{ margin: '8px 0 0 0', color: '#1a1a1a' }}>
                    {Object.keys(portfolioValue.portfolioData).length}
                  </Title>
                </Card>

                <Card style={metricCardStyle}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>Самый крупный актив</Text>
                  <Title level={4} style={{ margin: '8px 0 0 0', color: '#1a1a1a' }}>
                    {Object.entries(portfolioValue.portfolioData)
                      .sort((a, b) => b[1].percentage - a[1].percentage)[0][0]}
                  </Title>
                </Card>

                <Card style={metricCardStyle}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>Максимальная доля</Text>
                  <Title level={4} style={{ margin: '8px 0 0 0', color: '#1890ff' }}>
                    {Math.max(...Object.values(portfolioValue.portfolioData).map(d => d.percentage)).toFixed(1)}%
                  </Title>
                </Card>
              </div>
            </Card>

            <Card style={cardStyle}>
              <Title level={3} style={{ color: '#1a1a1a', marginBottom: '16px' }}>Состав портфеля</Title>
              <div className="space-y-4">
                {Object.entries(portfolioValue.portfolioData)
                  .sort((a, b) => b[1].percentage - a[1].percentage)
                  .map(([coin, data]) => (
                    <div key={coin} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                      <div className="mb-2 sm:mb-0 sm:mr-4">
                        <Text strong style={{ fontSize: '18px' }}>{coin}</Text>
                        <div className="text-gray-600 text-sm">${data.value.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <Progress
                          percent={data.percentage}
                          size="small"
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                          style={{ width: '120px' }}
                          showInfo={false}
                        />
                        <Text strong style={{ minWidth: '70px', textAlign: 'right', fontSize: '16px' }}>
                          {data.percentage.toFixed(1)}%
                        </Text>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}

        {analysis && ( // Показываем анализ только если он есть
          <Card style={cardStyle}>
            <Title level={2} style={{ color: '#1a1a1a', marginBottom: '24px' }}>AI Анализ</Title>
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <Text style={{ fontSize: '16px', color: '#666' }}>Анализируем ваш портфель...</Text>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                {analysis.split('\n').map((line, index) => {
                  if (line.match(/^\s*\d+\.\s/)) {
                    const listItemText = line.replace(/^\s*\d+\.\s*/, '').trim();
                    return listItemText ? <li key={index}>{listItemText}</li> : null;
                  } else {
                    return line.trim() ? <p key={index}>{line}</p> : <br key={index} />;
                  }
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
};

export default AiPortfolioAdvisor; 