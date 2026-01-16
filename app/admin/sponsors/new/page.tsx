"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewSponsorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tier: "",
    website_url: "",
    logo_url: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tier) {
      alert("Name and Tier are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      alert("Sponsor created successfully!");
      router.push("/admin/sponsors");
    } catch (err: any) {
      alert("Failed to create sponsor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Add Sponsor"
        subtitle="Create New"
        actions={
          <Link href="/admin/sponsors">
            <Button variant="outline" className="border-border/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <Card className="border-border/40 max-w-2xl">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Sponsor Details</CardTitle>
              <CardDescription>Add a new sponsor to your event</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sponsor Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tech Corp"
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tier *</label>
                <Select value={formData.tier} onValueChange={(v) => setFormData({ ...formData, tier: v })}>
                  <SelectTrigger className="bg-muted/50 border-border/50">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Platinum">💎 Platinum</SelectItem>
                    <SelectItem value="Gold">🥇 Gold</SelectItem>
                    <SelectItem value="Silver">🥈 Silver</SelectItem>
                    <SelectItem value="Bronze">🥉 Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Website URL</label>
              <Input
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://example.com"
                className="bg-muted/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Logo URL</label>
              <Input
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
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
                placeholder="Brief description of the sponsor"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Sponsor"}
              </Button>
              <Link href="/admin/sponsors">
                <Button type="button" variant="outline" className="border-border/50">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
