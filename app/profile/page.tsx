"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clearStoredAuth, fetchCurrentUser, getStoredAuth, updateCurrentUser } from "@/lib/api"
import type { User } from "@/lib/api"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const auth = getStoredAuth()
    if (!auth?.token) {
      router.replace("/login")
      return
    }
    loadProfile()
  }, [router])

  const loadProfile = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCurrentUser()
      setUser(data)
      setFullName(data.full_name || "")
      setUsername(data.username || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin người dùng.")
      if ((err as any)?.status === 401) {
        clearStoredAuth()
        router.replace("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!user) return
    setIsLoading(true)
    try {
      const updated = await updateCurrentUser({
        full_name: fullName,
        username,
        password: password || undefined,
      })
      setUser(updated)
      setMessage("Cập nhật thành công.")
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    clearStoredAuth()
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <nav className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-foreground">AusVisa</span>
          </Link>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/chat">
              <Button variant="ghost" size="sm">
                Chatbot
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Thông tin tài khoản</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Xem và cập nhật thông tin người dùng hiện tại (API /users/me).
          </p>
        </div>

        <Card className="border-border/80 bg-card/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Hồ sơ của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="text-sm text-destructive">{error}</div>}
            {message && <div className="text-sm text-emerald-600">{message}</div>}
            {isLoading && <p className="text-sm text-muted-foreground">Đang tải...</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input value={user?.email || ""} disabled className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Tên hiển thị</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ và tên"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Vai trò</label>
                  <Input value={user?.role || ""} disabled className="mt-1 capitalize" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Mật khẩu mới (tùy chọn)</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Để trống nếu không đổi"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={loadProfile} disabled={isLoading}>
                  Tải lại
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
