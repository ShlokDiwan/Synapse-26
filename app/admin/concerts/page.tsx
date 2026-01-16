"use client";

import { useState, useRef } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, Music } from "lucide-react";

type Concert = {
  id: number;
  name: string;
  date: string;
  venue: string;
  timing: string;
};

type ConcertFormState = Pick<Concert, "name" | "date" | "venue" | "timing">;

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([
    {
      id: 1,
      name: "Night 1 - EDM Night",
      date: "2025-12-22",
      venue: "Main Ground",
      timing: "7:00 PM - 11:00 PM",
    },
    {
      id: 2,
      name: "Night 2 - Rock Night",
      date: "2025-12-23",
      venue: "Main Ground",
      timing: "7:00 PM - 11:00 PM",
    },
  ]);

  const [formData, setFormData] = useState<ConcertFormState>({
    name: "",
    date: "",
    venue: "",
    timing: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<ConcertFormState>({
    name: "",
    date: "",
    venue: "",
    timing: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const nextIdRef = useRef<number>(Date.now());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConcerts((prev) => [...prev, { id: nextIdRef.current + prev.length, ...formData }]);
    setFormData({ name: "", date: "", venue: "", timing: "" });
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId !== null) {
      setConcerts((prev) => prev.filter((c) => c.id !== deletingId));
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleEditClick = (concert: Concert) => {
    setEditingId(concert.id);
    setEditData({
      name: concert.name,
      date: concert.date,
      venue: concert.venue,
      timing: concert.timing,
    });
    setIsEditOpen(true);
  };

  const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    setConcerts((prev) =>
      prev.map((c) => (c.id === editingId ? { ...c, ...editData } : c))
    );
    setIsEditOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Concert Nights"
        subtitle="Concerts"
        badge={
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            {concerts.length} total
          </Badge>
        }
      />

      {/* Add Concert Form */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-bold">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Add New Concert Night</CardTitle>
              <CardDescription>Keep your concert lineup up to date.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Concert Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Night 1 - EDM Night"
                required
                className="bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue</label>
              <Input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g., Main Ground"
                required
                className="bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timing</label>
              <Input
                type="text"
                value={formData.timing}
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                placeholder="e.g., 7:00 PM - 11:00 PM"
                required
                className="bg-muted/50 border-border/50"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border-0"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Concert Night
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Concerts Table */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white">
                <Music className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>All Concert Nights</CardTitle>
                <CardDescription>Manage and edit your lineup</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Concert Name</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Venue</TableHead>
                <TableHead className="text-muted-foreground">Timing</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {concerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No concerts added yet. Add your first concert above!
                  </TableCell>
                </TableRow>
              ) : (
                concerts.map((concert) => (
                  <TableRow key={concert.id} className="border-border/50 hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 text-red-400">
                          <Music className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{concert.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                        <Calendar className="mr-1 h-3 w-3" />
                        {concert.date}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted/50 border-border/50">
                        <MapPin className="mr-1 h-3 w-3" />
                        {concert.venue}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted/50 border-border/50">
                        <Clock className="mr-1 h-3 w-3" />
                        {concert.timing}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(concert)}
                          className="border-border/50 hover:bg-muted/50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(concert.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Concert Night</DialogTitle>
            <DialogDescription>
              Make changes to the concert details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSave}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Concert Name</label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Venue</label>
                <Input
                  value={editData.venue}
                  onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timing</label>
                <Input
                  value={editData.timing}
                  onChange={(e) => setEditData({ ...editData, timing: e.target.value })}
                  placeholder="e.g., 7:00 PM - 11:00 PM"
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="border-border/50">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border-0">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete Concert</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this concert? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-border/50">
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
