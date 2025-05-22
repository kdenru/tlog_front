import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Typography, Divider, Spin } from 'antd'
import { useUserStore } from '../store/user'
import type { Round as BaseRound } from '../store/rounds'

const { Title, Text } = Typography

interface WinnerInfo {
  username: string
  points: number
}

// Расширяем Round из стора для winner/myPoints
interface Round extends BaseRound {
  totalPoints: number
  winner?: WinnerInfo
  myPoints: number
}

const GOOSE = `
░░░░░░░░░░░░░░░░░░░░
░░░░░ТАПАЕМ░░░░░░░░░
░ГУСЯ░▄▀▀▀▄░РАБОТЯГИ░░
▄███▀░◐░░░▌░░░░░░░░░
░░░░▌░░░░░▐░░░░░░░░░
░░░░▐░░░░░▐░░░░░░░░░
░░░░▌░░░░░▐▄▄░░░░░░░
░░░░▌░░░░▄▀▒▒▀▀▀▀▄
░░░▐░░░░▐▒▒▒▒▒▒▒▒▀▀▄
░░░▐░░░░▐▄▒▒▒▒▒▒▒▒▒▒▀▄
░░░░▀▄░░░░▀▄▒▒▒▒▒▒▒▒▒▒▀▄
░░░░░░▀▄▄▄▄▄█▄▄▄▄▄▄▄▄▄▄▄▀▄
░░░░░░░░░░░▌▌░▌▌░░░░░
░░░░░░░░░░░▌▌░▌▌░░░░░
░░░░░░░░░▄▄▌▌▄▌▌░░░░░
`

function formatTime(ms: number) {
  const sec = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function RoundPage() {
  const { id } = useParams()
  const user = useUserStore((s) => s.user)
  const [round, setRound] = useState<Round | null>(null)
  const [loading, setLoading] = useState(true)
  const [myPoints, setMyPoints] = useState(0)
  const [timer, setTimer] = useState('00:00')
  const [status, setStatus] = useState<'cooldown'|'active'|'finished'>('cooldown')
  const prevStatus = useRef<'cooldown'|'active'|'finished'>('cooldown')
  const intervalRef = useRef<number | null>(null)

  // Фетчим инфу о раунде и своей статистике
  const fetchRound = useCallback(async () => { 
    setLoading(true)
    const res = await fetch(`http://localhost:3000/rounds/${id}`, { credentials: 'include' })
    const data = await res.json()
    setRound(data)
    setMyPoints(data.myPoints || 0)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchRound()
    // eslint-disable-next-line
  }, [id])

  // Таймер и статус + фетч статистики только при завершении
  useEffect(() => {
    if (!round) return;
    function update() {
      if (!round) return;
      const now = Date.now()
      const start = new Date(round.startAt).getTime()
      const end = new Date(round.endAt).getTime()
      let st: 'cooldown'|'active'|'finished' = 'finished'
      let t = 0
      if (now < start) {
        st = 'cooldown'
        t = start - now
      } else if (now >= start && now < end) {
        st = 'active'
        t = end - now
      }
      setStatus(st)
      setTimer(formatTime(t))
      // если только что перешли в finished — фетчим статистику
      if (prevStatus.current !== 'finished' && st === 'finished') {
        fetchRound()
      }
      prevStatus.current = st
    }
    update();
    if (status === 'finished') return;
    intervalRef.current = window.setInterval(update, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [round, fetchRound, status]);

  // Тап по гусю
  const handleTap = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (status !== 'active') return
    const res = await fetch('http://localhost:3000/taps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ roundId: id }),
    })
    const data = await res.json()
    setMyPoints(data.myPoints)
  }

  if (loading || !round) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>
  }

  return (
    <Card style={{ maxWidth: 600, margin: '32px auto', background: '#f5f6fa', borderRadius: 8 }} bodyStyle={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bbb', paddingBottom: 8, marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          {status === 'cooldown' && 'Cooldown'}
          {status === 'active' && 'Раунд активен!'}
          {status === 'finished' && 'Раунд завершён'}
        </Title>
        <Text>Имя игрока: <b>{user?.username}</b></Text>
      </div>
      <Divider />
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: 16,
            lineHeight: 1.1,
            userSelect: 'none',
            cursor: status === 'active' ? 'pointer' : 'default',
            margin: '0 auto',
            width: 'fit-content',
            borderRadius: 8,
            padding: 8,
            transition: 'background 0.2s',
          }}
          onClick={e => handleTap(e)}
        >
          {GOOSE}
        </pre>
        {status === 'cooldown' && (
          <>
            <Text style={{ display: 'block', marginTop: 16 }}>до начала раунда {timer}</Text>
          </>
        )}
        {status === 'active' && (
          <>
            <Text style={{ display: 'block', marginTop: 16 }}>До конца осталось: {timer}</Text>
            <Text style={{ display: 'block', marginTop: 8 }}>Мои очки — <b>{myPoints}</b></Text>
          </>
        )}
        {status === 'finished' && (
          <>
            <Divider />
            <div style={{ textAlign: 'left', margin: '0 auto', maxWidth: 340 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Всего</span>
                <b>{round.totalPoints}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Победитель — {round.winner?.username || '-'}</span>
                <b>{round.winner?.points || '-'}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Мои очки</span>
                <b>{myPoints}</b>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
} 