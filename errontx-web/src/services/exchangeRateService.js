const API_KEY = '1add74486fcf88dcadb67be7';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const fetchExchangeRates = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${API_KEY}/latest/USD`);
        const data = await response.json();
        
        if (!data.conversion_rates) {
            throw new Error('Не удалось получить курсы валют');
        }


        return {
            RUB: data.conversion_rates.RUB,
            BYN: data.conversion_rates.BYN
        };
    } catch (error) {
        console.error('Ошибка при получении курсов валют:', error);
        // Возвращаем значения по умолчанию в случае ошибки
        return {
            RUB: 80.15,
            BYN: 3.26
        };
    }
}; 