"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  ShoppingCart,
  Eye,
  DollarSign,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";

type Order = {
  order_id: number;
  customer_id: string;
  items: any;
  amount: number;
  order_date: string;
  payment_status: string;
  payment_method: string;
};

export default function MerchandiseOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/merchandise/orders");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalRevenue = orders.filter(o => o.payment_status === "paid").reduce((sum, o) => sum + o.amount, 0);
  const paidOrders = orders.filter(o => o.payment_status === "paid").length;
  const pendingOrders = orders.filter(o => o.payment_status !== "paid").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-muted-foreground">Error: {error}</p>
        <Button onClick={() => { setError(null); setLoading(true); fetchOrders(); }} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Orders"
        subtitle="Merchandise"
        badge={<Badge className="bg-primary/10 text-primary border-0">{orders.length} orders</Badge>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{paidOrders}</p>
            <p className="text-sm text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{pendingOrders}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-border/40">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View and manage merchandise orders</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Payment</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.order_id} className="border-border/50 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">#{order.order_id}</TableCell>
                    <TableCell className="text-muted-foreground">{order.customer_id}</TableCell>
                    <TableCell className="font-medium">₹{order.amount}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{order.order_date?.split("T")[0]}</TableCell>
                    <TableCell className="text-muted-foreground">{order.payment_method}</TableCell>
                    <TableCell>
                      <Badge className={order.payment_status === "paid" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}>
                        {order.payment_status === "paid" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/merchandise/orders/${order.order_id}`}>
                        <Button size="sm" variant="outline" className="border-border/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
