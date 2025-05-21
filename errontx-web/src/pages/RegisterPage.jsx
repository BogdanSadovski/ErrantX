import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, Card, Space, message } from 'antd';
import { useCallback, useState } from "react";
import { registerUser } from "../services/users";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  padding: '20px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '400px',
  background: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid #f0f0f0',
};

const logoStyle = {
  maxWidth: '180px',
  height: 'auto',
  marginBottom: '2rem',
  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
};

const formStyle = {
  padding: '20px',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
  color: '#1a1a1a',
  fontSize: '1.8rem',
  fontWeight: '600',
};

const inputStyle = {
  height: '45px',
  borderRadius: '8px',
};

const buttonStyle = {
  height: '45px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '500',
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState('');
    const [loading, setLoading] = useState(false);

    const onFinish = useCallback(async (values) => {
        try {
            setLoading(true);
            setRegisterError('');
            const userData = {
                email: values.email,
                password: values.password
            };
            
            await registerUser(userData);
            message.success('Регистрация успешна!');
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setRegisterError('Пользователь с таким email уже существует');
            } else {
                message.error('Ошибка при регистрации');
                console.error('Register error:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return (
        <div style={containerStyle}>
            <img
                src="./src/assets/logoErrX.png"
                alt="ErrantX Logo"
                style={logoStyle}
            />
            
            <Card style={cardStyle}>
                <Form
                    name="register"
                    onFinish={onFinish}
                    style={formStyle}
                    layout="vertical"
                >
                    <Typography.Title level={2} style={titleStyle}>
                        Создать аккаунт
                    </Typography.Title>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Пожалуйста, введите email!' },
                            { type: 'email', message: 'Введите корректный email!' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="Email" 
                            size="large"
                            style={inputStyle}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Пожалуйста, введите пароль!' },
                            { min: 6, message: 'Пароль должен быть не менее 6 символов!' }
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder="Пароль" 
                            size="large"
                            style={inputStyle}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Пожалуйста, подтвердите пароль!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder="Подтвердите пароль" 
                            size="large"
                            style={inputStyle}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            size="large"
                            loading={loading}
                            style={buttonStyle}
                        >
                            Зарегистрироваться
                        </Button>
                    </Form.Item>

                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                        <Typography.Text>
                            Уже есть аккаунт?{' '}
                            <Link to="/login" style={{ color: '#1890ff', fontWeight: '500' }}>
                                Войти
                            </Link>
                        </Typography.Text>
                    </Space>
                </Form>
            </Card>
        </div>
    );
}

