import { Layout, Typography, Card, Grid } from "antd";
import { useCryptoContext } from "../../context/crypto-context";
import PortfolioChart from "../PortfolioChart";
import AssetsTable from "../AssetsTable";

const { useBreakpoint } = Grid;

const contentStyle = {
  minHeight: 'calc(100vh - 60px)',
  padding: '24px',
  background: '#f5f5f5',
  width: '100%',
  overflowX: 'hidden',
};

const portfolioCardStyle = {
  marginBottom: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  width: '100%',
};

const chartCardStyle = {
  marginBottom: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  width: '100%',
  overflowX: 'auto',
};

const tableCardStyle = {
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  width: '100%',
  overflowX: 'auto',
};

const titleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a1a1a',
  fontFamily: 'Jost',
  wordBreak: 'break-word',
};

const cardContentStyle = {
  padding: '16px',
};

export default function AppContent() {
    const { assets, crypto } = useCryptoContext();
    const screens = useBreakpoint();
    
    // Создаем карту цен криптовалют для быстрого доступа
    const cryptoPriceMap = crypto.reduce((acc, coin) => {
        acc[coin.id] = Number(coin.price) || 0;
        return acc;
    }, {});

    // Рассчитываем общий капитал портфеля
    const totalPortfolioValue = assets.reduce((total, asset) => {
        const coinPrice = cryptoPriceMap[asset.coinId] || 0;
        return total + (Number(asset.amount) * coinPrice);
    }, 0);

    // Адаптивные стили для разных размеров экрана
    const getResponsiveStyles = () => {
        if (screens.xs) {
            return {
                contentPadding: '12px',
                cardMargin: '12px',
                titleSize: '20px',
            };
        }
        if (screens.sm) {
            return {
                contentPadding: '16px',
                cardMargin: '16px',
                titleSize: '22px',
            };
        }
        return {
            contentPadding: '24px',
            cardMargin: '24px',
            titleSize: '24px',
        };
    };

    const responsiveStyles = getResponsiveStyles();

    return (
        <Layout.Content style={{
            ...contentStyle,
            padding: responsiveStyles.contentPadding,
        }}>
            <Card 
                style={{
                    ...portfolioCardStyle,
                    marginBottom: responsiveStyles.cardMargin,
                }}
                bodyStyle={cardContentStyle}
            >
                <Typography.Title 
                    level={3} 
                    style={{
                        ...titleStyle,
                        fontSize: responsiveStyles.titleSize,
                    }}
                >
                    Портфель: {totalPortfolioValue.toFixed(2)} $
                </Typography.Title>
            </Card>

            <Card 
                style={{
                    ...chartCardStyle,
                    marginBottom: responsiveStyles.cardMargin,
                }}
                bodyStyle={cardContentStyle}
            >
                <div style={{ minWidth: screens.xs ? '300px' : '100%' }}>
                    <PortfolioChart />
                </div>
            </Card>

            <Card 
                style={tableCardStyle}
                bodyStyle={cardContentStyle}
            >
                <div style={{ minWidth: screens.xs ? '300px' : '100%' }}>
                    <AssetsTable />
                </div>
            </Card>
        </Layout.Content>
    );
}