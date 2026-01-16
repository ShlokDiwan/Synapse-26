"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  ImageIcon,
  Calendar,
  FolderOpen,
} from "lucide-react";

type Category = {
  id: number;
  name: string;
  description: string;
  eventCount: number;
  imageUrl: string;
};

type FormData = {
  name: string;
  description: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Technical", description: "Coding, Robotics, Hackathons", eventCount: 5, imageUrl: "" },
    { id: 2, name: "Cultural", description: "Dance, Music, Drama", eventCount: 4, imageUrl: "" },
    { id: 3, name: "Sports", description: "Gaming, E-sports", eventCount: 3, imageUrl: "" },
    { id: 4, name: "Workshop", description: "Hands-on learning sessions", eventCount: 2, imageUrl: "" },
  ]);

  const [formData, setFormData] = useState<FormData>({ name: "", description: "" });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) { setPreviewImage(null); return; }
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      setCategories(categories.map((cat) =>
        cat.id === editingId ? { ...cat, ...formData, imageUrl: previewImage || cat.imageUrl } : cat
      ));
      setEditingId(null);
    } else {
      setCategories([...categories, { id: Date.now(), ...formData, eventCount: 0, imageUrl: previewImage || "" }]);
    }
    setFormData({ name: "", description: "" });
    setPreviewImage(null);
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, description: category.description });
    setPreviewImage(category.imageUrl || null);
    setEditingId(category.id);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId !== null) {
      setCategories(categories.filter((cat) => cat.id !== deletingId));
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setPreviewImage(null);
  };

  const totalEvents = categories.reduce((sum, c) => sum + c.eventCount, 0);

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Event Categories"
        subtitle="Management"
        badge={
          <Badge className="bg-primary/10 text-primary border-0">
            {categories.length} categories
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{categories.length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{totalEvents}</p>
            <p className="text-sm text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Tag className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{(totalEvents / categories.length).toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Avg per Category</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="border-border/40">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {editingId ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <CardTitle>{editingId ? "Edit Category" : "Add Category"}</CardTitle>
                <CardDescription>
                  {editingId ? "Update category details" : "Create a new event category"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Technical, Cultural"
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  rows={3}
                  placeholder="Brief description of this category"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-muted/50 border-border/50 file:bg-primary/10 file:text-primary file:border-0 file:rounded file:px-3 file:py-1 file:text-sm file:font-medium"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingId ? "Update Category" : "Add Category"}
              </Button>

              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full border-border/50">
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview Card */}
          {(formData.name || previewImage) && (
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Card Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video max-w-[300px] mx-auto overflow-hidden rounded-xl bg-secondary">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="font-semibold text-white">{formData.name || "Category Name"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories Grid */}
          <Card className="border-border/40">
            <CardHeader className="border-b border-border/40">
              <CardTitle>All Categories</CardTitle>
              <CardDescription>Manage event categories and their images</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {categories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No categories yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-primary/30 transition-colors"
                    >
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="h-14 w-14 rounded-lg object-cover" />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Tag className="h-6 w-6 text-primary" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{category.description}</p>
                      </div>

                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {category.eventCount} events
                      </Badge>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="border-border/50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(category.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? Events in this category will need to be reassigned.
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
