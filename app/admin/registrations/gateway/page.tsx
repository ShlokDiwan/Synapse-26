"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowLeft, Settings, CreditCard, Loader2, AlertCircle, Save } from "lucide-react";

type PaymentMethod = {
  method_id: number;
  method_name: string;
  gateway_charge: number;
};

export default function GatewaySettingsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = async () => {
    try {
      const res = await fetch("/api/admin/registrations/gateway");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMethods(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleChargeChange = (methodId: number, charge: string) => {
    setMethods(methods.map(m =>
      m.method_id === methodId ? { ...m, gateway_charge: parseFloat(charge) || 0 } : m
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/registrations/gateway", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(methods),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      alert("Gateway settings saved successfully!");
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

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
        <Button onClick={() => { setError(null); setLoading(true); fetchMethods(); }} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Gateway Settings"
        subtitle="Payment Configuration"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/registrations">
              <Button variant="outline" className="border-border/50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        }
      />

      <Card className="border-border/40 max-w-2xl">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure gateway charges for each payment method</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {methods.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No payment methods configured</p>
          ) : (
            <div className="space-y-4">
              {methods.map((method) => (
                <div
                  key={method.method_id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{method.method_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Charge %:</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={method.gateway_charge}
                      onChange={(e) => handleChargeChange(method.method_id, e.target.value)}
                      className="w-24 bg-muted/50 border-border/50 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
