"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {apiFetch} from "@/lib/api";

export type User = {
    username: string,
    role: 0 | 1
};

type UserContextType = {
    user: User | null;
    refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }

        const data = await apiFetch("/api/user/me");
        if (data.code === 1) {
            setUser(data.data as User);
            console.log("Got user info: ", data.data)
        } else {
            setUser(null);
            return;
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider
            value={{user, refreshUser: loadUser}}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
}