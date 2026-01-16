"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Merchandise = {
  id: number;
  name: string;
  price: number;
  sizes: string[];
  imageUrl: string;
  available: boolean;
  description: string;
};

export default function MerchandiseManagementPage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/merchandise/management");
      const data = await response.json();
      if (data.products) {
        const mappedProducts = data.products.map((product: { product_id: number; product_name: string; price: number; available_sizes?: string[]; product_image?: string; is_available: boolean; description?: string }) => ({
          id: product.product_id,
          name: product.product_name,
          price: product.price,
          sizes: product.available_sizes || [],
          imageUrl: product.product_image || "",
          available: product.is_available,
          description: product.description || "",
        }));
        setMerchandise(mappedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId !== null) {
      try {
        const response = await fetch(`/api/admin/merchandise/management/${deletingId}`, { method: "DELETE" });
        if (response.ok) {
          setMerchandise(merchandise.filter((m) => m.id !== deletingId));
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const toggleAvailability = async (id: number) => {
    const item = merchandise.find((m) => m.id === id);
    if (!item) return;

    try {
      const response = await fetch(`/api/admin/merchandise/management/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !item.available }),
      });

      if (response.ok) {
        setMerchandise(merchandise.map((m) => m.id === id ? { ...m, available: !m.available } : m));
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const availableCount = merchandise.filter(m => m.available).length;
  const totalValue = merchandise.reduce((sum, m) => sum + m.price, 0);

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Merchandise"
        subtitle="Store Management"
        badge={
          <Badge className="bg-primary/10 text-primary border-0">
            {merchandise.length} products
          </Badge>
        }
        actions={
          <Link href="/admin/merchandise/management/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        }
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
            <p className="text-2xl font-bold">{merchandise.length}</p>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{availableCount}</p>
            <p className="text-sm text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{merchandise.length - availableCount}</p>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <Card className="border-border/40">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription>Manage your merchandise inventory</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-xl border border-border/40">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : merchandise.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products found.</p>
              <p className="text-sm">Add your first product to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {merchandise.map((item) => (
                <div
                  key={item.id}
                  className="group p-5 rounded-xl border border-border/40 bg-card hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => toggleAvailability(item.id)}
                    />
                  </div>

                  <Badge
                    className={item.available
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mb-3"
                      : "bg-red-500/10 text-red-400 border-red-500/30 mb-3"
                    }
                  >
                    {item.available ? (
                      <><CheckCircle className="mr-1 h-3 w-3" /> In Stock</>
                    ) : (
                      <><XCircle className="mr-1 h-3 w-3" /> Out of Stock</>
                    )}
                  </Badge>

                  <p className="text-2xl font-bold text-primary mb-3">₹{item.price}</p>

                  {item.sizes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1.5">Sizes:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.sizes.map((size) => (
                          <Badge key={size} variant="secondary" className="bg-secondary/50 text-xs">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-border/40">
                    <Link href={`/admin/merchandise/management/${item.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-border/50">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(item.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-border/50">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
