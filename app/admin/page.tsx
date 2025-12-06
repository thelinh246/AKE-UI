"use client"

import { useMemo, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Link2, Play, ShieldCheck, UserPlus, Users } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type UserStatus = "active" | "pending" | "suspended"

const userStats = [
  {
    title: "Tổng người dùng",
    value: "1,204",
    meta: "+42 trong tuần",
    trend: "up",
    icon: <Users className="h-4 w-4 text-primary" />,
  },
  {
    title: "Đang hoạt động",
    value: "876",
    meta: "72% online",
    trend: "up",
    icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
  },
  {
    title: "Chờ duyệt",
    value: "68",
    meta: "+8 yêu cầu",
    trend: "up",
    icon: <UserPlus className="h-4 w-4 text-accent" />,
  },
  {
    title: "Bị tạm khóa",
    value: "12",
    meta: "-3 so với hôm qua",
    trend: "down",
    icon: <ArrowDownRight className="h-4 w-4 text-red-500" />,
  },
]

const users = [
  {
    name: "Nguyễn Bảo Anh",
    email: "baoanh@ausvisa.ai",
    role: "Admin",
    status: "active" as UserStatus,
    neoId: "#1273",
    lastActive: "2 giờ trước",
    sessions: 12,
  },
  {
    name: "Lê Minh Khoa",
    email: "khoa.le@ausvisa.ai",
    role: "Editor",
    status: "active" as UserStatus,
    neoId: "#1281",
    lastActive: "35 phút trước",
    sessions: 9,
  },
  {
    name: "Trần Gia Huy",
    email: "huy.tran@ausvisa.ai",
    role: "Reviewer",
    status: "pending" as UserStatus,
    neoId: "#1294",
    lastActive: "Chưa đăng nhập",
    sessions: 0,
  },
  {
    name: "Phạm Thu Hà",
    email: "ha.pham@ausvisa.ai",
    role: "Support",
    status: "suspended" as UserStatus,
    neoId: "#1199",
    lastActive: "5 ngày trước",
    sessions: 2,
  },
  {
    name: "Đỗ Thảo My",
    email: "my.do@ausvisa.ai",
    role: "Editor",
    status: "active" as UserStatus,
    neoId: "#1301",
    lastActive: "12 phút trước",
    sessions: 6,
  },
]

const graphNodes = [
  { id: "user-01", label: "Bảo Anh", type: "user", x: 60, y: 60 },
  { id: "user-02", label: "Minh Khoa", type: "user", x: 240, y: 40 },
  { id: "user-03", label: "Gia Huy", type: "user", x: 330, y: 120 },
  { id: "role-admin", label: "Role: Admin", type: "role", x: 150, y: 140 },
  { id: "role-editor", label: "Role: Editor", type: "role", x: 260, y: 180 },
  { id: "tenant", label: "Tenant: AusVisa", type: "tenant", x: 120, y: 210 },
  { id: "cluster", label: "Neo4j Cluster", type: "cluster", x: 320, y: 230 },
]

const graphEdges = [
  { from: "user-01", to: "role-admin" },
  { from: "user-02", to: "role-editor" },
  { from: "user-03", to: "role-editor" },
  { from: "role-admin", to: "tenant" },
  { from: "role-editor", to: "tenant" },
  { from: "tenant", to: "cluster" },
  { from: "role-admin", to: "cluster" },
]

const statusStyle: Record<UserStatus, { label: string; variant: "secondary" | "outline"; tone: string }> = {
  active: { label: "Hoạt động", variant: "secondary", tone: "text-green-700" },
  pending: { label: "Chờ duyệt", variant: "outline", tone: "text-amber-600" },
  suspended: { label: "Tạm khóa", variant: "outline", tone: "text-red-600" },
}

const actionStyle: Record<UserStatus, { label: string; variant: "destructive" | "secondary" }> = {
  active: { label: "Block", variant: "destructive" },
  pending: { label: "Activate", variant: "secondary" },
  suspended: { label: "Activate", variant: "secondary" },
}

const nodeColors: Record<string, string> = {
  user: "hsl(var(--primary))",
  role: "hsl(var(--accent))",
  tenant: "hsl(var(--secondary))",
  cluster: "hsl(var(--muted-foreground))",
}

export default function AdminPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all")

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase()
    return users.filter((u) => {
      const matchesKeyword = `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(keyword)
      const matchesStatus = statusFilter === "all" ? true : u.status === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [search, statusFilter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-semibold text-lg">A</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bảng điều khiển</p>
              <h1 className="text-2xl sm:text-3xl font-bold">Quản lý người dùng & Neo4j</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Đồng bộ Neo4j
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm">
              <UserPlus className="h-4 w-4" />
              Thêm người dùng
            </Button>
          </div>
        </div>

        <Card className="border-border/80 bg-card/90 backdrop-blur shadow-lg">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-bold">Tổng quan người dùng</CardTitle>
              <p className="text-muted-foreground text-sm sm:text-base">
                Theo dõi trạng thái, vai trò và liên kết đồ thị Neo4j cho từng người dùng.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Neo4j online
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Link2 className="h-3.5 w-3.5" /> Sync mỗi 15 phút
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userStats.map((item) => (
                <div
                  key={item.title}
                  className="border border-border/70 rounded-xl bg-gradient-to-br from-card to-muted/30 p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.title}</span>
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">{item.icon}</div>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <span
                      className={`text-xs font-medium inline-flex items-center gap-1 ${
                        item.trend === "up" ? "text-green-600" : item.trend === "down" ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {item.trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
                      {item.trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
                      {item.meta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-border/80 bg-card/80 backdrop-blur">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-lg font-semibold">Danh sách người dùng</CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-3 py-2">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Tìm theo tên, email, vai trò..."
                      className="h-8 w-60 bg-transparent border-none px-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "active", "pending", "suspended"] as const).map((status) => (
                      <Badge
                        key={status}
                        variant={statusFilter === status ? "secondary" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setStatusFilter(status)}
                      >
                        {status === "all" ? "Tất cả" : statusStyle[status].label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Neo4j ID</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{user.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={statusStyle[user.status].variant} className={statusStyle[user.status].tone}>
                            {statusStyle[user.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {user.neoId}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant={actionStyle[user.status].variant}>
                              {actionStyle[user.status].label}
                            </Button>
                            <Button size="sm" variant="outline">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80 backdrop-blur">
              <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">Đồ thị Neo4j (User → Role → Tenant)</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Xem nhanh liên kết người dùng, vai trò và node tenant trên cluster Neo4j.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Link2 className="h-3.5 w-3.5" /> 7 nodes · {graphEdges.length} edges
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Aura secured
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl border border-border/60 bg-muted/10 p-3">
                  <svg viewBox="0 0 400 260" className="w-full h-full">
                    {graphEdges.map((edge) => {
                      const from = graphNodes.find((n) => n.id === edge.from)
                      const to = graphNodes.find((n) => n.id === edge.to)
                      if (!from || !to) return null
                      return (
                        <line
                          key={`${edge.from}-${edge.to}`}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="var(--border)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      )
                    })}
                    {graphNodes.map((node) => (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={14}
                          fill={nodeColors[node.type] || "hsl(var(--primary))"}
                          stroke="white"
                          strokeWidth="2"
                          opacity="0.92"
                        />
                        <text x={node.x} y={node.y + 28} textAnchor="middle" className="text-[10px] fill-muted-foreground">
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-sm font-semibold mb-2">Legend</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.user }} />
                        <span className="text-sm text-muted-foreground">User</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.role }} />
                        <span className="text-sm text-muted-foreground">Role</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.tenant }} />
                        <span className="text-sm text-muted-foreground">Tenant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.cluster }} />
                        <span className="text-sm text-muted-foreground">Cluster</span>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-[160px] rounded-lg border border-border/60 p-3">
                    <div className="space-y-2">
                      {graphEdges.map((edge) => {
                        const from = graphNodes.find((n) => n.id === edge.from)
                        const to = graphNodes.find((n) => n.id === edge.to)
                        return (
                          <div key={`${edge.from}-${edge.to}`} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {from?.label} → {to?.label}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              RELATES_TO
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
