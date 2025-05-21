import { Select, Space, Typography, Flex, Divider, Form, Input, Button, Checkbox, InputNumber, DatePicker, Result, Spin, message } from "antd"
import { useState, useRef } from "react"
import { useCryptoContext } from "../../context/crypto-context"
import CoinInfo from "../CoinInfo"

const validateMessages = {
    required: " ${label} обязателен!",
    type: {
        number: " ${label} должен быть числом!",
    },
    number: {
        range: " ${label} должен быть между ${min} и ${max}",
    },
};

export default function AddAssetsForm({onClose}) {
    const [form] = Form.useForm() 
    const { crypto, addAsset, userId } = useCryptoContext()
    const [coin, setCoin] = useState(null) 
    const [submitting, setSubmitting] = useState(false) 
    const assetRef = useRef(null)

    if (!userId) {
        return (
            <Result
                status="warning"
                title="Требуется авторизация"
                subTitle="Для добавления ассетов необходимо войти в систему"
                extra={[
                    <Button type="primary" key="login" onClick={() => window.location.href = '/login'}>
                        Войти
                    </Button>,
                ]}
            />
        )
    }

    if(submitting){
        return (
            <Result
                status="success"
                title="Ассет успешно добавлен!"
                subTitle= {`Добавлено ${assetRef.current.amount} ${coin.name} по цене ${assetRef.current.price} USD`}
                extra={[
                    <Button type="primary" key="console" onClick={onClose}>
                        Закрыть
                    </Button>,
                ]}
            />
        )
    }

    if(!coin){
        return (
            <Select 
                style={{ width: '100%' }}
                placeholder="Выберите монету"
                onSelect={(v) => setCoin(crypto.find(coin => coin.id === v))}
                optionLabelProp='label'
                options={crypto.map(coin => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                optionRender={(option) => (
                    <Space>
                        <img 
                            src={option.data.icon} 
                            alt={option.data.label} 
                            style={{ width: '20px', height: '20px' }}
                        /> 
                        {option.data.label}
                    </Space>
                )}
            />
        )
    } 

    async function onFinish(values) {
        try {
            const newAsset = {
                id: coin.id,
                name: coin.name,
                coinId: coin.id,
                amount: values.amount,
                price: values.price,
                date: values.date?.$d ?? new Date(),
            }
            console.log('Данные формы:', values);
            console.log('Подготовленный ассет:', newAsset);
            
            assetRef.current = newAsset
            setSubmitting(true)
            await addAsset(newAsset)
            window.location.reload();
        } catch (error) {
            console.error('Ошибка при добавлении ассета:', error);
            message.error('Ошибка при добавлении ассета')
            setSubmitting(false)
        }
    }

    function handleAmountChange(value) {
        const price = form.getFieldValue('price')
        form.setFieldsValue({ 
            total: +(price * value).toFixed(4), 
        })
    }

    function handlePriceChange(value) {
        const amount = form.getFieldValue('amount')
        form.setFieldsValue({ 
            total: +(value * amount).toFixed(4), 
        })
    }

    return (
        <Form
            form={form} 
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
            style={{ maxWidth: 600 }}
            initialValues={{
                price: +coin.price.toFixed(4),
            }}
            onFinish={onFinish}
            validateMessages={validateMessages} 
        >
            <CoinInfo coin={coin} />
            <Divider/>

            <Form.Item  
                label="Количество"
                name="amount"
                rules={[{ required: true, type: 'number', min: 0 }]}
            >
                <InputNumber 
                    placeholder="Введите количество монет"
                    onChange={handleAmountChange} 
                    style={{width: '100%'}}
                />
            </Form.Item>

            <Form.Item
                label="Дата и время"
                name="date"
            >
                <DatePicker showTime style={{width: '100%'}} />
            </Form.Item>

            <Form.Item
                label="Цена"
                name="price"
            >
                <InputNumber onChange={handlePriceChange} style={{width: '100%'}} />
            </Form.Item>

            <Form.Item
                label="Итого"
                name="total"
            >
                <InputNumber disabled style={{width: '100%'}} />
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Добавить ассет
                </Button>
            </Form.Item>
        </Form>
    )
}