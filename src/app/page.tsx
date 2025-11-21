"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Page() {
    const { user } = useAuth();
    return (
        <main className="p-8 space-y-3">
            <h1 className="text-2xl font-bold">Creative Rights & Revenue Tracker</h1>
            <p>Your app is running.</p>
            <div className="space-x-4">
                <Link href="/dashboard" className="text-blue-600 underline">Go to Dashboard</Link>
                {!user && (
                    <>
                        <Link href="/login" className="text-blue-600 underline">Login</Link>
                        <Link href="/signup" className="text-blue-600 underline">Sign up</Link>
                    </>
                )}
            </div>
        </main>
    );
}