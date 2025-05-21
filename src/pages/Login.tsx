import { useState } from 'react'
import { Form, Input, Button, Typography, Card } from 'antd'

const { Title } = Typography

export default function Login() {
  const [loading, setLoading] = useState(false)

  const onFinish = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <Card
        style={{ minWidth: 340, maxWidth: 400, width: '100%' }}
        title={<Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>Войти</Title>}
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
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Пароль:</span>}
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
            style={{ marginBottom: 28 }}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
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