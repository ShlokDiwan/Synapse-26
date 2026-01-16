"use client";

import { useState } from "react";
import { useUsers, useUserEventList } from "@/hooks/use-admin-data";
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
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  Download,
  Search,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Tag,
  X,
  Users as UsersIcon,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: eventListData } = useUserEventList();
  const { data, loading, error, refetch } = useUsers({
    page,
    limit,
    searchParams: searchTerm || undefined,
    filter: eventFilter !== "all" ? eventFilter : undefined,
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const allEvents = eventListData?.events || [];

  // Download CSV
  const downloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "College", "Registration Date", "Events"];
    const rows = users.map((u) => [
      u.user_name,
      u.email,
      u.phone,
      u.college,
      u.registration_date,
      u.event_count,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${eventFilter === "all" ? "all" : eventFilter.replace(/\\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Get initials
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-muted-foreground">Error: {error}</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        subtitle="Management"
        badge={
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            {total} users
          </Badge>
        }
        actions={
          <Button
            onClick={downloadCSV}
            disabled={users.length === 0}
            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border-0"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or college..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
            <Select value={eventFilter} onValueChange={(v) => { setEventFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-56 bg-muted/50 border-border/50">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Events</SelectItem>
                {allEvents.map((event) => (
                  <SelectItem key={event} value={event}>{event}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filters */}
          {(searchTerm || eventFilter !== "all") && (
            <div className="flex items-center gap-2 mt-4 text-sm">
              <span className="text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1 bg-muted border-border/50">
                  Search: &quot;{searchTerm}&quot;
                  <X className="h-3 w-3 cursor-pointer" onClick={() => { setSearchTerm(""); setPage(1); }} />
                </Badge>
              )}
              {eventFilter !== "all" && (
                <Badge variant="secondary" className="gap-1 bg-red-500/20 text-red-300 border-red-500/30">
                  Event: {eventFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => { setEventFilter("all"); setPage(1); }} />
                </Badge>
              )}
              <button
                onClick={() => { setSearchTerm(""); setEventFilter("all"); setPage(1); }}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white">
                <UsersIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  {total} users found
                  {eventFilter !== "all" && ` registered for "${eventFilter}"`}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Phone</TableHead>
                <TableHead className="text-muted-foreground">College</TableHead>
                <TableHead className="text-muted-foreground">Registered</TableHead>
                <TableHead className="text-muted-foreground">Events</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.user_id} className="border-border/50 hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-red-600 to-rose-700">
                          <AvatarFallback className="bg-gradient-to-br from-red-600 to-rose-700 text-white text-sm font-medium">
                            {getInitials(user.user_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.user_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted/50 text-foreground border-border/50">
                        <GraduationCap className="mr-1 h-3 w-3" />
                        {user.college}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.registration_date.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        {user.event_count} events
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="border-border/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Page {page} of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="border-border/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12 bg-gradient-to-br from-red-600 to-rose-700">
                <AvatarFallback className="bg-gradient-to-br from-red-600 to-rose-700 text-white font-medium">
                  {selectedUser && getInitials(selectedUser.user_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedUser?.user_name}</span>
                <p className="text-sm font-normal text-muted-foreground">{selectedUser?.college}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Date</p>
                    <p className="font-medium">{selectedUser.registration_date.split("T")[0]}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Registered Events ({selectedUser.event_count})</span>
                </div>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                  {selectedUser.event_count} events
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)} className="border-border/50">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
