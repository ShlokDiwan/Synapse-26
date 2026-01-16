"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, ShoppingCart, User, DollarSign, Package, Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";

type Order = {
  order_id: number;
  customer_id: string;
  items: any;
  amount: number;
  order_date: string;
  payment_status: string;
  payment_method: string;
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/merchandise/orders/${id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-muted-foreground">Error: {error || "Order not found"}</p>
        <Link href="/admin/merchandise/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title={`Order #${order.order_id}`}
        subtitle="Order Details"
        actions={
          <Link href="/admin/merchandise/orders">
            <Button variant="outline" className="border-border/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Order Info</CardTitle>
                <CardDescription>Order #{order.order_id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono">#{order.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID</span>
              <span className="font-medium">{order.customer_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date</span>
              <span>{order.order_date?.split("T")[0]}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Payment details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-lg">₹{order.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span>{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className={order.payment_status === "paid" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}>
                {order.payment_status === "paid" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                {order.payment_status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 md:col-span-2">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <CardTitle>Items</CardTitle>
                <CardDescription>Ordered items</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(order.items, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
