"use client";

import { useState } from "react";
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
import {
  Download,
  Search,
  Settings,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  Ticket,
} from "lucide-react";

type Registration = {
  id: number;
  userName: string;
  email: string;
  phone: string;
  college: string;
  event: string;
  category: string;
  participationType: string;
  teamSize: number;
  registrationDate: string;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
  transactionId: string;
};

type GatewayCharges = {
  [key: string]: number;
};

// Mock data
const initialRegistrations: Registration[] = [
  {
    id: 1,
    userName: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    college: "ABC College",
    event: "Hackathon 2025",
    category: "Technical",
    participationType: "Solo",
    teamSize: 1,
    registrationDate: "2025-12-10",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    amount: 200,
    transactionId: "TXN123456789",
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    college: "XYZ University",
    event: "Dance Battle",
    category: "Cultural",
    participationType: "Duet",
    teamSize: 2,
    registrationDate: "2025-12-11",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    amount: 250,
    transactionId: "TXN987654321",
  },
  {
    id: 3,
    userName: "Mike Johnson",
    email: "mike@example.com",
    phone: "9876543212",
    college: "DEF Institute",
    event: "Hackathon 2025",
    category: "Technical",
    participationType: "Group",
    teamSize: 5,
    registrationDate: "2025-12-12",
    paymentMethod: "Debit Card",
    paymentStatus: "Pending",
    amount: 500,
    transactionId: "TXN456789123",
  },
  {
    id: 4,
    userName: "Sarah Williams",
    email: "sarah@example.com",
    phone: "9876543213",
    college: "GHI College",
    event: "Coding Competition",
    category: "Technical",
    participationType: "Solo",
    teamSize: 1,
    registrationDate: "2025-12-13",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    amount: 150,
    transactionId: "TXN789456123",
  },
  {
    id: 5,
    userName: "Tom Brown",
    email: "tom@example.com",
    phone: "9876543214",
    college: "JKL University",
    event: "Dance Battle",
    category: "Cultural",
    participationType: "Group",
    teamSize: 6,
    registrationDate: "2025-12-14",
    paymentMethod: "Net Banking",
    paymentStatus: "Paid",
    amount: 720,
    transactionId: "TXN321654987",
  },
];

export default function RegistrationsPage() {
  const [registrations] = useState<Registration[]>(initialRegistrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isGatewaySettingsOpen, setIsGatewaySettingsOpen] = useState(false);
  const [gatewayCharges, setGatewayCharges] = useState<GatewayCharges>({
    UPI: 2,
    "Credit Card": 3,
    "Debit Card": 2.5,
    "Net Banking": 2,
  });

  // Get unique events for filter
  const allEvents = [...new Set(registrations.map((r) => r.event))];

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === "all" || reg.event === eventFilter;
    const matchesStatus = paymentStatusFilter === "all" || reg.paymentStatus === paymentStatusFilter;
    return matchesSearch && matchesEvent && matchesStatus;
  });

  // Calculate gateway charges
  const calculateGatewayCharge = (amount: number, method: string) => {
    const chargePercentage = gatewayCharges[method] || 0;
    return (amount * chargePercentage) / 100;
  };

  // Calculate statistics
  const paidRegistrations = filteredRegistrations.filter((r) => r.paymentStatus === "Paid");
  const totalGrossRevenue = paidRegistrations.reduce((sum, r) => sum + r.amount, 0);
  const totalGatewayCharges = paidRegistrations.reduce(
    (sum, r) => sum + calculateGatewayCharge(r.amount, r.paymentMethod),
    0
  );
  const totalNetRevenue = totalGrossRevenue - totalGatewayCharges;
  const paidCount = paidRegistrations.length;
  const pendingCount = filteredRegistrations.filter((r) => r.paymentStatus === "Pending").length;

  // Download CSV
  const downloadCSV = () => {
    const headers = ["ID", "Name", "Email", "Event", "Amount", "Status", "Transaction ID"];
    const rows = filteredRegistrations.map((r) => [
      r.id,
      r.userName,
      r.email,
      r.event,
      r.amount,
      r.paymentStatus,
      r.transactionId,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Stats cards data
  const statsCards = [
    { title: "Total Registrations", value: filteredRegistrations.length, icon: Users, gradient: "from-red-600 to-rose-700" },
    { title: "Paid", value: paidCount, icon: CheckCircle2, gradient: "from-emerald-600 to-emerald-700" },
    { title: "Pending", value: pendingCount, icon: Clock, gradient: "from-amber-600 to-amber-700" },
    { title: "Gross Revenue", value: `₹${totalGrossRevenue.toLocaleString()}`, icon: DollarSign, gradient: "from-red-600 to-rose-700" },
    { title: "Gateway Charges", value: `₹${totalGatewayCharges.toFixed(2)}`, icon: CreditCard, gradient: "from-rose-600 to-red-700" },
    { title: "Net Revenue", value: `₹${totalNetRevenue.toFixed(2)}`, icon: TrendingUp, gradient: "from-red-600 to-rose-700" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Registrations"
        subtitle="Event Management"
        badge={
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            {filteredRegistrations.length} total
          </Badge>
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsGatewaySettingsOpen(true)} className="border-border/50 hover:bg-muted/50">
              <Settings className="mr-2 h-4 w-4" />
              Gateway Settings
            </Button>
            <Button onClick={downloadCSV} className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border-0">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-red-500/10`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full md:w-48 bg-muted/50 border-border/50">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Events</SelectItem>
                {allEvents.map((event) => (
                  <SelectItem key={event} value={event}>{event}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-muted/50 border-border/50">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>All Registrations</CardTitle>
              <CardDescription>Click on a row to view details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Event</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No registrations found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((reg) => (
                  <TableRow
                    key={reg.id}
                    className="border-border/50 cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedRegistration(reg)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{reg.userName}</p>
                        <p className="text-sm text-muted-foreground">{reg.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                        {reg.event}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{reg.participationType}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">₹{reg.amount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          reg.paymentStatus === "Paid"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }
                      >
                        {reg.paymentStatus === "Paid" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {reg.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {reg.registrationDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedRegistration(reg); }} className="hover:bg-muted/50">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Registration Details Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Transaction ID: {selectedRegistration?.transactionId}
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{selectedRegistration.userName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedRegistration.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="font-medium">{selectedRegistration.phone}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">College</label>
                  <p className="font-medium">{selectedRegistration.college}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Event</label>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{selectedRegistration.event}</Badge>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="font-medium">{selectedRegistration.category}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Participation</label>
                  <p className="font-medium">{selectedRegistration.participationType} ({selectedRegistration.teamSize})</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <p className="font-medium">{selectedRegistration.paymentMethod}</p>
                </div>
              </div>
              <div className="border-t border-border/50 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₹{selectedRegistration.amount}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">Gateway Charge ({gatewayCharges[selectedRegistration.paymentMethod]}%)</span>
                  <span className="text-red-400">-₹{calculateGatewayCharge(selectedRegistration.amount, selectedRegistration.paymentMethod).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50">
                  <span className="font-semibold">Net Amount</span>
                  <span className="font-bold text-emerald-400">
                    ₹{(selectedRegistration.amount - calculateGatewayCharge(selectedRegistration.amount, selectedRegistration.paymentMethod)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRegistration(null)} className="border-border/50">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gateway Settings Dialog */}
      <Dialog open={isGatewaySettingsOpen} onOpenChange={setIsGatewaySettingsOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Gateway Charges Settings</DialogTitle>
            <DialogDescription>
              Configure payment gateway charge percentages
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(gatewayCharges).map(([method, charge]) => (
              <div key={method} className="flex items-center gap-4">
                <label className="flex-1 text-sm font-medium">{method}</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={charge}
                    onChange={(e) => setGatewayCharges({ ...gatewayCharges, [method]: parseFloat(e.target.value) })}
                    className="w-20 bg-muted/50 border-border/50"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGatewaySettingsOpen(false)} className="border-border/50">
              Cancel
            </Button>
            <Button onClick={() => setIsGatewaySettingsOpen(false)} className="bg-gradient-to-r from-red-600 to-rose-700 text-white border-0">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
