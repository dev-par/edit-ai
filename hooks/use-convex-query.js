import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
    // Always call useQuery to follow Rules of Hooks
    const result = useQuery(query, ...args);

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only process the result
        if (result === undefined) {
            setIsLoading(true);
            setError(null);
        } else {
            try {
                setData(result);
                setError(null);
            } catch (error) {
                setError(error);
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    }, [result]);

    return {
        data,
        isLoading,
        error,
    }
}

export const useConvexMutation = (mutation) => {
    const mutationFn = useMutation(mutation);

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = async (...args) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mutationFn(...args);
            setData(response);
            return response;
        } catch (error) {
            setError(error);
            toast.error(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, data, isLoading, error };
}