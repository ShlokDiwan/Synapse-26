"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
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
import {
  Plus,
  Edit,
  Trash2,
  Mic2,
  Music,
  Calendar,
} from "lucide-react";

interface Artist {
  id: number;
  name: string;
  concertNight: string;
  genre: string;
  revealDate: string;
  bio: string;
}

const initialArtists: Artist[] = [
  { id: 1, name: "DJ Shadow", concertNight: "Night 1 - EDM Night", genre: "EDM", revealDate: "2025-12-18", bio: "International EDM artist" },
  { id: 2, name: "The Rock Band", concertNight: "Night 2 - Rock Night", genre: "Rock", revealDate: "2025-12-20", bio: "Famous rock band from India" },
  { id: 3, name: "Indie Collective", concertNight: "Night 3 - Indie Night", genre: "Indie", revealDate: "2025-12-22", bio: "Popular indie music ensemble" },
];

const genreColors: Record<string, string> = {
  EDM: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Rock: "bg-red-500/10 text-red-400 border-red-500/30",
  Indie: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Pop: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  Classical: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId !== null) {
      setArtists(artists.filter((a) => a.id !== deletingId));
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Artists"
        subtitle="Concert Management"
        badge={
          <Badge className="bg-primary/10 text-primary border-0">
            {artists.length} artists
          </Badge>
        }
        actions={
          <Link href="/admin/artists/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Artist
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mic2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{artists.length}</p>
            <p className="text-sm text-muted-foreground">Total Artists</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Music className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{[...new Set(artists.map(a => a.genre))].length}</p>
            <p className="text-sm text-muted-foreground">Genres</p>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{[...new Set(artists.map(a => a.concertNight))].length}</p>
            <p className="text-sm text-muted-foreground">Concert Nights</p>
          </CardContent>
        </Card>
      </div>

      {/* Artists Table */}
      <Card className="border-border/40">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mic2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>All Artists</CardTitle>
              <CardDescription>Manage concert performers and artists</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Artist</TableHead>
                <TableHead className="text-muted-foreground">Genre</TableHead>
                <TableHead className="text-muted-foreground">Concert Night</TableHead>
                <TableHead className="text-muted-foreground">Reveal Date</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <Mic2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No artists added yet.</p>
                  </TableCell>
                </TableRow>
              ) : (
                artists.map((artist) => (
                  <TableRow key={artist.id} className="border-border/40 hover:bg-secondary/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Mic2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{artist.name}</p>
                          <p className="text-sm text-muted-foreground">{artist.bio}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={genreColors[artist.genre] || "bg-muted text-muted-foreground"}>
                        <Music className="mr-1 h-3 w-3" />
                        {artist.genre}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary/50">
                        {artist.concertNight}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary/50">
                        <Calendar className="mr-1 h-3 w-3" />
                        {artist.revealDate}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/artists/${artist.id}`}>
                          <Button variant="outline" size="sm" className="border-border/50">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(artist.id)}
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete Artist</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this artist? This action cannot be undone.
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
