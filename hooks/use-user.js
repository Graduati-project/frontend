import { useQuery } from "@tanstack/react-query";
import { profile } from "../services/user";

export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => profile(),
    });
}