"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Calendar, Loader2, AlertCircle } from "lucide-react";

type EventItem = {
  event_name: string;
};

export default function RegistrationEventListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/admin/registrations/eventlist");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setEvents(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
        <Link href="/admin/registrations">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Event List"
        subtitle="For Registrations"
        badge={<Badge className="bg-primary/10 text-primary border-0">{events.length} events</Badge>}
        actions={
          <Link href="/admin/registrations">
            <Button variant="outline" className="border-border/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <Card className="border-border/40">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Available Events</CardTitle>
              <CardDescription>Events that have registrations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No events found</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {events.map((event, idx) => (
                <Badge key={idx} className="bg-primary/10 text-primary border-0 px-3 py-1">
                  {event.event_name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
