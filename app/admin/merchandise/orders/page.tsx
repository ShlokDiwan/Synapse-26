"use client";

import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Download,
  Search,
  ShoppingCart,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  Eye,
  X,
} from "lucide-react";

type OrderItem = {
  product: string;
  size: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  userName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  paymentStatus: "Paid" | "Pending";
  paymentMethod?: string;
};

export default function MerchandiseOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productFilter, setProductFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/merchandise/orders");
      const data = await response.json();
      if (data.orders) {
        const mappedOrders = data.orders.map((order: { order_id: number; customer_id: string; items?: OrderItem[]; amount: number; order_date: string; payment_status: "Paid" | "Pending"; payment_method?: string }) => ({
          id: order.order_id,
          userName: order.customer_id,
          email: "",
          phone: "",
          items: order.items || [],
          totalAmount: order.amount,
          orderDate: new Date(order.order_date).toISOString().split("T")[0],
          paymentStatus: order.payment_status,
          paymentMethod: order.payment_method,
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique products
  const allProducts = [...new Set(orders.flatMap((order) => order.items.map((item) => item.product)))];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct =
      productFilter === "all" || order.items.some((item) => item.product === productFilter);
    return matchesSearch && matchesProduct;
  });

  // Stats
  const paidOrders = filteredOrders.filter(o => o.paymentStatus === "Paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = filteredOrders.filter(o => o.paymentStatus === "Pending");

  // Download CSV
  const downloadCSV = () => {
    const headers = ["Order ID", "Customer Name", "Email", "Phone", "Product", "Size", "Quantity", "Price", "Total", "Date", "Status"];
    const rows: (string | number)[][] = [];
    filteredOrders.forEach((order) => {
      order.items.forEach((item, idx) => {
        rows.push([
          idx === 0 ? order.id : "",
          idx === 0 ? order.userName : "",
          idx === 0 ? order.email : "",
          idx === 0 ? order.phone : "",
          item.product,
          item.size,
          item.quantity,
          item.price,
          idx === 0 ? order.totalAmount : "",
          idx === 0 ? order.orderDate : "",
          idx === 0 ? order.paymentStatus : "",
        ]);
      });
    });
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `merchandise_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Merchandise Orders"
        subtitle="Store Management"
        badge={
          <Badge className="bg-primary/10 text-primary border-0">
            {filteredOrders.length} orders
          </Badge>
        }
        actions={
          <Button onClick={downloadCSV} disabled={filteredOrders.length === 0} className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{filteredOrders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{paidOrders.length}</p>
            <p className="text-sm text-muted-foreground">Paid Orders</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{pendingOrders.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/40">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full md:w-48 bg-muted/50 border-border/50">
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Products</SelectItem>
                {allProducts.map((product) => (
                  <SelectItem key={product} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchTerm || productFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => { setSearchTerm(""); setProductFilter("all"); }}
                className="border-border/50"
              >
                <X className="mr-1 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border/40">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View order details and export data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Order ID</TableHead>
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground">Items</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-border/40 hover:bg-secondary/20">
                      <TableCell>
                        <span className="font-medium">#{order.id}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.userName}</p>
                          {order.email && <p className="text-sm text-muted-foreground">{order.email}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                          {order.items.length} item(s)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">₹{order.totalAmount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.orderDate}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={order.paymentStatus === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }
                        >
                          {order.paymentStatus === "Paid" ? (
                            <><CheckCircle className="mr-1 h-3 w-3" /> Paid</>
                          ) : (
                            <><Clock className="mr-1 h-3 w-3" /> Pending</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder?.orderDate}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Details */}
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="font-semibold mb-3 text-sm">Customer Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.userName}</p>
                  </div>
                  {selectedOrder.email && (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.email}</p>
                    </div>
                  )}
                  {selectedOrder.phone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.phone}</p>
                    </div>
                  )}
                  {selectedOrder.paymentMethod && (
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Items Ordered</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                      <div>
                        <p className="font-medium">{item.product}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-xl font-bold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Payment Status</span>
                  <Badge
                    className={selectedOrder.paymentStatus === "Paid"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)} className="border-border/50">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
