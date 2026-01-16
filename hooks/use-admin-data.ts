/**
 * Custom React Hooks for Admin Data Fetching
 * Provides hooks with loading states, error handling, and refetching
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import * as adminApi from "@/lib/admin-api";

type UseDataResult<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

/**
 * Generic hook for fetching data
 */
function useAdminData<T>(
    fetchFn: () => Promise<adminApi.ApiResponse<T>>,
    deps: any[] = []
): UseDataResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const response = await fetchFn();
        if (response.error) {
            setError(response.error);
            setData(null);
        } else {
            setData(response.data || null);
        }
        setLoading(false);
    }, deps);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// Events Hooks
// ============================================================================

export function useEvents() {
    return useAdminData(() => adminApi.eventsApi.getAll(), []);
}

export function useCreateEvent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createEvent = async (payload: adminApi.CreateEventPayload) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.eventsApi.create(payload);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return null;
        }
        return response.data;
    };

    return { createEvent, loading, error };
}

export function useUpdateEvent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateEvent = async (
        eventId: number,
        payload: Partial<adminApi.CreateEventPayload> & { event_id: number }
    ) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.eventsApi.update(eventId, payload);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return null;
        }
        return response.data;
    };

    return { updateEvent, loading, error };
}

export function useDeleteEvent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteEvent = async (eventId: number) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.eventsApi.delete(eventId);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return false;
        }
        return true;
    };

    return { deleteEvent, loading, error };
}

// ============================================================================
// Categories Hooks
// ============================================================================

export function useCategories() {
    return useAdminData(() => adminApi.categoriesApi.getAll(), []);
}

// ============================================================================
// Registrations Hooks
// ============================================================================

export function useRegistrations(filters: adminApi.RegistrationFilters = {}) {
    const filtersKey = JSON.stringify(filters);
    return useAdminData(
        () => adminApi.registrationsApi.getAll(filters),
        [filtersKey]
    );
}

export function useRegistrationEventList() {
    return useAdminData(() => adminApi.registrationsApi.getEventList(), []);
}

// ============================================================================
// Users Hooks
// ============================================================================

export function useUsers(filters: adminApi.UserFilters = {}) {
    const filtersKey = JSON.stringify(filters);
    return useAdminData(() => adminApi.usersApi.getAll(filters), [filtersKey]);
}

export function useUserEventList() {
    return useAdminData(() => adminApi.usersApi.getEventList(), []);
}

// ============================================================================
// Sponsors Hooks
// ============================================================================

export function useSponsors() {
    return useAdminData(() => adminApi.sponsorsApi.getAll(), []);
}

export function useSponsorById(id: number) {
    return useAdminData(() => adminApi.sponsorsApi.getById(id), [id]);
}

export function useCreateSponsor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createSponsor = async (payload: Omit<adminApi.Sponsor, "sponsor_id">) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.sponsorsApi.create(payload);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return null;
        }
        return response.data;
    };

    return { createSponsor, loading, error };
}

export function useUpdateSponsor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateSponsor = async (id: number, payload: Partial<adminApi.Sponsor>) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.sponsorsApi.update(id, payload);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return null;
        }
        return response.data;
    };

    return { updateSponsor, loading, error };
}

export function useDeleteSponsor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteSponsor = async (id: number) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.sponsorsApi.delete(id);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return false;
        }
        return true;
    };

    return { deleteSponsor, loading, error };
}

// ============================================================================
// Artists Hooks
// ============================================================================

export function useArtists() {
    return useAdminData(() => adminApi.artistsApi.getAll(), []);
}

export function useCreateArtist() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createArtist = async (payload: Omit<adminApi.Artist, "id" | "concert">) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.artistsApi.create(payload);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return null;
        }
        return response.data;
    };

    return { createArtist, loading, error };
}

export function useDeleteArtist() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteArtist = async (id: number) => {
        setLoading(true);
        setError(null);
        const response = await adminApi.artistsApi.delete(id);
        setLoading(false);
        if (response.error) {
            setError(response.error);
            return false;
        }
        return true;
    };

    return { deleteArtist, loading, error };
}

// ============================================================================
// Merchandise Hooks
// ============================================================================

export function useMerchandiseProducts() {
    return useAdminData(() => adminApi.merchandiseApi.products.getAll(), []);
}

export function useMerchandiseOrders() {
    return useAdminData(() => adminApi.merchandiseApi.orders.getAll(), []);
}
