import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Typography, Card, message } from 'antd'
import { useUserStore } from '../store/user'

export default function Login() {
  const navigate = useNavigate()
  const setUser = useUserStore((s) => s.setUser)

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        throw new Error('Неверный логин или пароль')
      }
      const data = await res.json()
      setUser(data)
      message.success('Успешный вход!')
      navigate('/')
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Ошибка входа'
      message.error(error)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <Card
        style={{ minWidth: 340, maxWidth: 400, width: '100%' }}
        title={<Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>Войти</Typography.Title>}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 12 }}
          requiredMark={false}
        >
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Имя пользователя:</span>}
            name="username"
            rules={[{ required: true, message: 'Введите имя пользователя' }]}
            style={{ marginBottom: 28 }}
          >
            <Input size="large" autoComplete="username" />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Пароль:</span>}
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
            style={{ marginBottom: 28 }}
          >
            <Input.Password size="large" autoComplete="current-password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100%' }}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
} 