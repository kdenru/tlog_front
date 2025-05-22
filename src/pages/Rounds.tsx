import { useEffect, useState, useCallback } from 'react'
import { useRoundsStore, type Round } from '../store/rounds'
import { useUserStore } from '../store/user'
import { Link } from 'react-router-dom'
import { Button, Card, Typography, Divider, Empty } from 'antd'

const { Title, Text } = Typography

const STATUS_COLORS: Record<string, string> = {
  'Активен': '#52c41a',
  'Завершён': '#ff4d4f',
  'Ещё не начат': '#bfbfbf',
}

function getRoundStatus(startAt: string, endAt: string) {
  const now = new Date()
  const start = new Date(startAt)
  const end = new Date(endAt)
  if (now < start) return 'Ещё не начат'
  if (now >= start && now < end) return 'Активен'
  return 'Завершён'
}

function RoundCard({ round }: { round: Round }) {
  const [status, setStatus] = useState(() => getRoundStatus(round.startAt, round.endAt))

  useEffect(() => {
    if (status === 'Завершён') return
    const interval = setInterval(() => {
      const newStatus = getRoundStatus(round.startAt, round.endAt)
      setStatus(newStatus)
      if (newStatus === 'Завершён') {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [round.startAt, round.endAt, status])

  const color = STATUS_COLORS[status]

  return (
    <Card style={{ marginBottom: 24, border: '1px solid #bbb', borderRadius: 6 }} bodyStyle={{ padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ color, fontSize: 18 }}>●</span>
        <Link to={`/rounds/${round.id}`} style={{ fontWeight: 600, fontSize: 16, color: '#222' }}>
          Round ID: {round.id}
        </Link>
      </div>
      <Text style={{ display: 'block', marginBottom: 4 }}>
        Start: {new Date(round.startAt).toLocaleString('ru-RU')}
      </Text>
      <Text style={{ display: 'block', marginBottom: 4 }}>
        End: {new Date(round.endAt).toLocaleString('ru-RU')}
      </Text>
      <Divider style={{ margin: '12px 0' }} />
      <Text>Статус: <b style={{ color }}>{status}</b></Text>
    </Card>
  )
}

export default function Rounds() {
  const rounds = useRoundsStore((s) => s.rounds)
  const setRounds = useRoundsStore((s) => s.setRounds)
  const user = useUserStore((s) => s.user)
  const [creating, setCreating] = useState(false)

  const fetchRounds = useCallback(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/rounds`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setRounds(data))
      .catch(() => setRounds([]))
  }, [setRounds])

  useEffect(() => {
    fetchRounds()
  }, [fetchRounds])

  const handleCreateRound = async () => {
    setCreating(true)
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/rounds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      })
      fetchRounds()
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card style={{ maxWidth: 700, margin: '32px auto', background: '#f5f6fa', borderRadius: 8 }} bodyStyle={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bbb', paddingBottom: 8, marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Список РАУНДОВ</Title>
        <Text>Имя игрока: <b>{user?.username}</b></Text>
      </div>
      {user?.role === 'admin' && (
        <Button type="primary" style={{ marginBottom: 24 }} onClick={handleCreateRound} loading={creating}>
          Создать раунд
        </Button>
      )}
      {rounds.length === 0 ? (
        <Empty description="Раундов пока нет" style={{ margin: '48px 0' }} />
      ) : (
        rounds.map((round) => (
          <RoundCard key={round.id} round={round} />
        ))
      )}
    </Card>
  )
} 