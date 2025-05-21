const API_KEY = 'g3b2vIKB0g/Pnu9sM0nJy6FMlxEaUOv4rTmIlQ+AHLg=';
const BASE_URL = 'https://openapiv1.coinstats.app';
const BACKEND_URL = 'http://localhost:5223';

export async function fakeFetchCrypto() {
    try {
        console.log('Начинаем запрос к API...');
        const response = await fetch(`${BASE_URL}/coins`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-API-KEY': API_KEY
            }
        });
        
        console.log('Статус ответа:', response.status);
        console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            console.error('Ошибка API:', response.status, response.statusText);
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Получены данные от API:', data);
        
        // Проверяем структуру данных
        if (data.result && Array.isArray(data.result)) {
            console.log('Количество полученных монет:', data.result.length);
            // Логируем первую монету полностью, чтобы увидеть все поля
            if (data.result.length > 0) {
                console.log('Первая монета:', data.result[0]);
            }
            
            return {
                result: data.result.map(coin => {
                    // Проверяем все возможные варианты названий полей, включая priceChange1d и priceChange1w
                    const priceChange1h = coin.priceChange1h || coin.price_change_1h || coin.price_change_1_h || coin.price_change_1h_percent || 0;
                    const priceChange24h = coin.priceChange24h || coin.price_change_24h || coin.price_change_24_h || coin.price_change_24h_percent || coin.priceChange1d || 0;
                    const priceChange7d = coin.priceChange7d || coin.price_change_7d || coin.price_change_7_d || coin.price_change_7d_percent || coin.priceChange1w || 0;
                    
                    return {
                        id: coin.id,
                        name: coin.name,
                        price: coin.price,
                        icon: coin.icon,
                        symbol: coin.symbol,
                        marketCap: coin.marketCap,
                        volume24h: coin.volume24h,
                        priceChange1h,
                        priceChange24h,
                        priceChange7d,
                        redditUrl: coin.redditUrl,
                        twitterUrl: coin.twitterUrl,
                        websiteUrl: coin.websiteUrl,
                        description: coin.description,
                        rank: coin.rank,
                        circulatingSupply: coin.circulatingSupply,
                        totalSupply: coin.totalSupply,
                        maxSupply: coin.maxSupply
                    };
                })
            };
        } else {
            console.error('Неожиданная структура ответа API:', data);
            throw new Error('Unexpected API response structure');
        }
    } catch (error) {
        console.error('Ошибка при получении данных о криптовалютах:', error);
        // Возвращаем тестовые данные в случае ошибки
        return {
            result: [
                {
                    id: 'bitcoin',
                    name: 'Bitcoin',
                    price: 50000,
                    icon: 'https://static.coinstats.app/coins/1650455588819.png',
                    symbol: 'BTC',
                    marketCap: 1000000000000,
                    volume24h: 50000000000,
                    priceChange1h: 0.5,
                    priceChange24h: 2.5,
                    priceChange7d: 5.0,
                    rank: 1
                }
            ]
        };
    }
}

export async function fetchAssets(userId) {
    try {
        const response = await fetch(`http://localhost:5223/Assets/getAsset?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch assets');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching assets:', error);
        return [];
    }
}

export async function saveAsset(asset, userId) {
    try {
        // Проверяем userId
        if (!userId) {
            throw new Error('UserId отсутствует! Невозможно сохранить ассет без id пользователя.');
        }
        // Сохраняем id монеты и числовые значения как float
        const formattedAsset = {
            UserId: userId,
            AssetName: asset.coinId || asset.id || asset.name, // id монеты
            AssetAmount: Number(asset.amount), // float
            AssetPrice: Number(asset.price),   // float
            AssetDate: asset.date ? new Date(asset.date).toISOString() : new Date().toISOString()
        };
        
        console.log('Подготовленные данные для отправки:', formattedAsset);
        
        const response = await fetch(`http://localhost:5223/Assets/addAsset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formattedAsset),
        });
        
        console.log('Статус ответа:', response.status);
        console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Ошибка сервера:', {
                status: response.status,
                statusText: response.statusText,
                body: errorData
            });
            throw new Error(`Failed to save asset: ${response.status} ${response.statusText}`);
        }
        
        // Проверяем, есть ли тело ответа
        let savedAsset = null;
        const contentLength = response.headers.get('content-length');
        if (contentLength && contentLength !== '0') {
            savedAsset = await response.json();
        }
        console.log('Успешный ответ сервера:', savedAsset);
        return savedAsset;
    } catch (error) {
        console.error('Ошибка при сохранении ассета:', error);
        throw error;
    }
}

export async function deleteAsset(assetId, userId, asset) {
    try {
        const url = `http://localhost:5223/Assets/deleteAsset`;
        const deletePayload = {
            userId: userId,
            assetName: asset.coinId || asset.assetName || asset.name,
            assetAmount: Number(asset.amount),
            assetPrice: Number(asset.price),
            assetDate: asset.date || asset.assetDate || new Date().toISOString()
        };
        console.log('Удаление ассета: URL:', url);
        console.log('Удаление ассета: payload:', deletePayload);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(deletePayload),
        });
        if (!response.ok) {
            throw new Error('Failed to delete asset');
        }
        return true;
    } catch (error) {
        console.error('Error deleting asset:', error);
        throw error;
    }
}