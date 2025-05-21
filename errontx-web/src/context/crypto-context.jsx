import { createContext, useState, useEffect, useContext } from 'react';
import { fakeFetchCrypto, fetchAssets, saveAsset, deleteAsset } from '../api';
import { percentDifferens, capitalize } from '../utils';
import { message } from 'antd';

const CryptoContext = createContext({
    assets: [],
    crypto: [],
    loading: false,
    userId: null,
});

export function CryptoContextProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [crypto, setCrypto] = useState([]);
    const [assets, setAssets] = useState([]);
    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

    // Следим за изменением userId в localStorage (например, после логина/логаута)
    useEffect(() => {
        const handleStorage = () => {
            setUserId(localStorage.getItem('userId'));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Также обновляем userId при каждом монтировании компонента (например, после логина)
    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
    }, []);

    function mapAssets(assets, result) {
        console.log('Mapping assets:', assets);
        console.log('Available coins:', result);
        
        return assets.map(asset => {
            console.log('Processing asset:', asset);
            const coinId = asset.assetName;
            const coin = result.find((c) => c.id === coinId);
            console.log('Found coin in mapAssets:', coin);
            
            // Преобразуем все числовые значения
            const amount = Number(asset.assetAmount) || 0;
            const price = Number(asset.assetPrice) || 0;
            const coinPrice = Number(coin?.price) || 0;
            
            if (!coin) {
                console.log('No matching coin found for asset:', asset);
                return {
                    id: asset.id,
                    name: asset.assetName || 'Unknown Asset',
                    coinId,
                    amount: amount,
                    price: price,
                    date: asset.assetDate,
                    grow: false,
                    growPercent: 0,
                    totalAmount: 0,
                    totalProfit: 0,
                    priceChange1h: 0,
                    priceChange1d: 0,
                    priceChange7d: 0
                };
            }
            
            const totalAmount = amount * coinPrice;
            const totalProfit = totalAmount - (amount * price);
            const grow = price < coinPrice;
            const growPercent = percentDifferens(price, coinPrice);
            
            return {
                id: asset.id,
                name: coin ? coin.name : asset.assetName,
                coinId,
                amount: amount,
                price: price,
                date: asset.assetDate,
                grow: grow,
                growPercent: growPercent,
                totalAmount: totalAmount,
                totalProfit: totalProfit,
                priceChange1h: coin.priceChange1h || 0,
                priceChange1d: coin.priceChange24h || 0,
                priceChange7d: coin.priceChange7d || 0
            };
        });
    }

    async function preload() {
        setLoading(true);
        try {
            // Загружаем данные о криптовалютах
            const { result } = await fakeFetchCrypto();
            if (result && Array.isArray(result)) {
                setCrypto(result);
            } else {
                console.error('Неверный формат данных о криптовалютах');
                setCrypto([]);
            }

            // Загружаем ассеты пользователя, если он авторизован
            if (userId) {
                try {
                    const userAssets = await fetchAssets(userId);
                    if (userAssets && Array.isArray(userAssets)) {
                        setAssets(mapAssets(userAssets, result));
                    } else {
                        console.log('Нет ассетов пользователя или неверный формат данных');
                        setAssets([]);
                    }
                } catch (error) {
                    console.error('Ошибка при загрузке ассетов пользователя:', error);
                    setAssets([]);
                }
            } else {
                setAssets([]);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            message.error('Ошибка при загрузке данных');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        preload();
        // const interval = setInterval(preload, 2 * 60 * 1000);
        // return () => clearInterval(interval);
    }, [userId]);

    async function addAsset(newAsset) {
        try {
            // Берём userId всегда из localStorage
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                message.error('Необходимо войти в систему');
                return;
            }
            const savedAsset = await saveAsset(newAsset, currentUserId);
            if (savedAsset) {
                // После добавления ассета — подгружаем ассеты из БД
                const { result } = await fakeFetchCrypto();
                const userAssets = await fetchAssets(currentUserId);
                setAssets(mapAssets(userAssets, result));
                message.success('Ассет успешно добавлен');
            }
        } catch (error) {
            message.error('Ошибка при добавлении ассета');
        }
    }

    async function removeAsset(assetId) {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                message.error('Необходимо войти в систему');
                return;
            }
            const asset = assets.find(a => a.id === assetId);
            await deleteAsset(assetId, currentUserId, asset);
            // После удаления ассета — подгружаем ассеты из БД
            const { result } = await fakeFetchCrypto();
            const userAssets = await fetchAssets(currentUserId);
            setAssets(mapAssets(userAssets, result));
            message.success('Ассет успешно удален');
        } catch (error) {
            message.error('Ошибка при удалении ассета');
        }
    }

    return (
        <CryptoContext.Provider value={{ 
            assets, 
            crypto, 
            loading, 
            addAsset, 
            removeAsset,
            userId 
        }}>
            {children}
        </CryptoContext.Provider>
    );
}

export default CryptoContext;

export function useCryptoContext() {
    return useContext(CryptoContext);
}


