"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
    Eye,
    Users,
    Clock,
    TrendingUp,
    Globe,
    Monitor,
    Smartphone,
    Tablet,
    ArrowUp,
    ArrowDown,
    BarChart3,
    Activity,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Mock analytics data
const overviewStats = [
    { title: "Page Views", value: "12,847", change: "+12.5%", up: true, icon: Eye },
    { title: "Unique Visitors", value: "4,523", change: "+8.3%", up: true, icon: Users },
    { title: "Avg. Session", value: "3m 42s", change: "-2.1%", up: false, icon: Clock },
    { title: "Bounce Rate", value: "42.3%", change: "-5.2%", up: true, icon: TrendingUp },
];

// Chart data - Page views over last 7 days
const pageViewsData = [
    { day: "Mon", views: 1420, visitors: 890 },
    { day: "Tue", views: 1680, visitors: 1020 },
    { day: "Wed", views: 2100, visitors: 1350 },
    { day: "Thu", views: 1890, visitors: 1180 },
    { day: "Fri", views: 2450, visitors: 1520 },
    { day: "Sat", views: 2780, visitors: 1780 },
    { day: "Sun", views: 2420, visitors: 1490 },
];

// Registrations by event category
const registrationsByCategory = [
    { category: "Technical", count: 186, fill: "hsl(var(--primary))" },
    { category: "Cultural", count: 124, fill: "hsl(var(--chart-2))" },
    { category: "Sports", count: 78, fill: "hsl(var(--chart-3))" },
    { category: "Workshop", count: 45, fill: "hsl(var(--chart-4))" },
    { category: "Gaming", count: 23, fill: "hsl(var(--chart-5))" },
];

// Hourly traffic today
const hourlyTraffic = [
    { hour: "6am", visitors: 45 },
    { hour: "8am", visitors: 120 },
    { hour: "10am", visitors: 280 },
    { hour: "12pm", visitors: 420 },
    { hour: "2pm", visitors: 380 },
    { hour: "4pm", visitors: 520 },
    { hour: "6pm", visitors: 680 },
    { hour: "8pm", visitors: 590 },
    { hour: "10pm", visitors: 320 },
];

// Traffic sources for pie chart
const trafficSources = [
    { name: "Direct", value: 45, color: "#dc2626" },
    { name: "Social", value: 28, color: "#f97316" },
    { name: "Organic", value: 18, color: "#eab308" },
    { name: "Referral", value: 9, color: "#22c55e" },
];

// Weekly revenue
const weeklyRevenue = [
    { week: "Week 1", revenue: 24500, registrations: 89 },
    { week: "Week 2", revenue: 32800, registrations: 124 },
    { week: "Week 3", revenue: 45200, registrations: 167 },
    { week: "Week 4", revenue: 52100, registrations: 198 },
];

const topPages = [
    { path: "/events", views: 3421, change: "+15%" },
    { path: "/register", views: 2847, change: "+23%" },
    { path: "/pronite", views: 2156, change: "+8%" },
    { path: "/merchandise", views: 1823, change: "+12%" },
    { path: "/sponsors", views: 987, change: "-3%" },
];

const deviceStats = [
    { device: "Desktop", icon: Monitor, percentage: 52, sessions: "6,678" },
    { device: "Mobile", icon: Smartphone, percentage: 41, sessions: "5,267" },
    { device: "Tablet", icon: Tablet, percentage: 7, sessions: "903" },
];

const realtimeVisitors = [
    { page: "/events/hackathon-2025", visitors: 23 },
    { page: "/register", visitors: 18 },
    { page: "/pronite", visitors: 12 },
    { page: "/merchandise", visitors: 8 },
    { page: "/", visitors: 6 },
];

// Custom tooltip style
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg shadow-xl p-3">
                <p className="text-sm font-medium mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 pb-8">
            <AdminPageHeader
                title="Website Analytics"
                subtitle="Analytics"
                badge={
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-0 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                    </Badge>
                }
            />

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-border/40">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                                        {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Page Views Chart - Large */}
                <Card className="lg:col-span-2 border-border/40">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Traffic Overview</CardTitle>
                                <CardDescription>Page views and unique visitors (last 7 days)</CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-secondary/50">Weekly</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={pageViewsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                                    <XAxis
                                        dataKey="day"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        name="Page Views"
                                        stroke="#dc2626"
                                        strokeWidth={2}
                                        fill="url(#colorViews)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visitors"
                                        name="Visitors"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        fill="url(#colorVisitors)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <span className="text-muted-foreground">Page Views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-orange-500" />
                                <span className="text-muted-foreground">Unique Visitors</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Traffic Sources Pie Chart */}
                <Card className="border-border/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            Traffic Sources
                        </CardTitle>
                        <CardDescription>Where visitors come from</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={trafficSources}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {trafficSources.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, 'Share']}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-2xl font-bold">12.8K</span>
                                <span className="text-xs text-muted-foreground">Total</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {trafficSources.map((source) => (
                                <div key={source.name} className="flex items-center gap-2 text-sm">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                                    <span className="text-muted-foreground">{source.name}</span>
                                    <span className="ml-auto font-medium">{source.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Second Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registrations by Category */}
                <Card className="border-border/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            Registrations by Category
                        </CardTitle>
                        <CardDescription>Total registrations per event category</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={registrationsByCategory} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} horizontal={false} />
                                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="category"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={80}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value: number) => [value, 'Registrations']}
                                    />
                                    <Bar
                                        dataKey="count"
                                        radius={[0, 4, 4, 0]}
                                    >
                                        {registrationsByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Hourly Traffic */}
                <Card className="border-border/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Today&apos;s Traffic
                        </CardTitle>
                        <CardDescription>Visitors by hour of day</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={hourlyTraffic} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                                    <XAxis
                                        dataKey="hour"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value: number) => [value, 'Visitors']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="visitors"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={{ fill: '#22c55e', strokeWidth: 0, r: 3 }}
                                        activeDot={{ r: 5, fill: '#22c55e' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="pages" className="space-y-6">
                <TabsList className="bg-secondary/30 border border-border/40">
                    <TabsTrigger value="pages">Top Pages</TabsTrigger>
                    <TabsTrigger value="devices">Devices</TabsTrigger>
                    <TabsTrigger value="realtime">Real-time</TabsTrigger>
                </TabsList>

                {/* Top Pages */}
                <TabsContent value="pages">
                    <Card className="border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Pages</CardTitle>
                            <CardDescription>Most visited pages on your website</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                {topPages.map((page, index) => (
                                    <div key={page.path} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                                            <div>
                                                <p className="font-medium">{page.path}</p>
                                                <p className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={page.change.startsWith("+")
                                                ? "bg-emerald-500/10 text-emerald-400 border-0"
                                                : "bg-red-500/10 text-red-400 border-0"
                                            }
                                        >
                                            {page.change.startsWith("+") ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                                            {page.change}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Devices */}
                <TabsContent value="devices">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {deviceStats.map((device) => {
                            const Icon = device.icon;
                            return (
                                <Card key={device.device} className="border-border/40">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <span className="text-3xl font-bold">{device.percentage}%</span>
                                        </div>
                                        <h3 className="font-semibold text-lg">{device.device}</h3>
                                        <p className="text-sm text-muted-foreground">{device.sessions} sessions</p>
                                        <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                                                style={{ width: `${device.percentage}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Real-time */}
                <TabsContent value="realtime">
                    <Card className="border-border/40">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Real-time Visitors</CardTitle>
                                    <CardDescription>Active users on your website right now</CardDescription>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-0 flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    67 online
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                {realtimeVisitors.map((visitor) => (
                                    <div key={visitor.page} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="font-medium">{visitor.page}</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-secondary/50">
                                            {visitor.visitors} visitors
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
