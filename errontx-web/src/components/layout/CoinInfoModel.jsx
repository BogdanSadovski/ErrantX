import { Modal, Flex, Typography, Tag, Divider } from 'antd';
 
export default function CoinInfoModel({coin}) {
    // Отладочная информация
    console.log('Coin data:', coin);
    
    const formatPriceChange = (value) => {
        if (value === null || value === undefined) return '0.00';
        return value.toFixed(2);
    };

    return( 
    <>
    <Flex align='center'>
        <img src={coin.icon} alt={coin.name} style={{width: 40, marginRight: 10}}  />
        <Typography.Title level={2} style={{margin: 0}}  > ({coin.symbol}) {coin.name}</Typography.Title>
    </Flex>
    <Divider/>
    <Typography.Paragraph>
        <Typography.Text strong style={{marginRight: 10}}>1 час:</Typography.Text> 
        <Tag color={coin.priceChange1h > 0 ? 'green' : 'red'}>
            {formatPriceChange(coin.priceChange1h)}%
        </Tag>
        <Typography.Text strong style={{marginRight: 10}}>1 день:</Typography.Text> 
        <Tag color={coin.priceChange24h > 0 ? 'green' : 'red'}>
            {formatPriceChange(coin.priceChange24h)}%
        </Tag>
        <Typography.Text strong style={{marginRight: 10}}>1 неделя:</Typography.Text> 
        <Tag color={coin.priceChange7d > 0 ? 'green' : 'red'}>
            {formatPriceChange(coin.priceChange7d)}%
        </Tag>
    </Typography.Paragraph>
    <Divider/>
    <Typography.Paragraph>
        <Typography.Text strong style={{marginRight: 10}}>Цена:</Typography.Text> 
        <Tag>{coin.price?.toFixed(5)}$</Tag>
    </Typography.Paragraph>
    <Divider/>
    <Typography.Paragraph>
        <Typography.Text strong style={{marginRight: 10}}>Рыночная капитализация:</Typography.Text> 
        <Tag>{coin.marketCap?.toFixed(2)}$</Tag>
    </Typography.Paragraph>
    <Divider/>
    <Typography.Paragraph>
        {coin.twitterUrl && (
            <a href={coin.twitterUrl} target="_blank" rel="noopener noreferrer">
                <img src="./src/assets/X_icon.svg.png" style={{width: 30, height: 30, marginLeft: 10}} alt="Twitter"/>
            </a>
        )}
        {coin.redditUrl && (
            <a href={coin.redditUrl} target="_blank" rel="noopener noreferrer">
                <img src="./src/assets/reditLogo.png" style={{width: 30, height: 30, marginLeft: 10}} alt="Reddit"/>
            </a>
        )}
    </Typography.Paragraph>
    </>
    )
}