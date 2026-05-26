"use client";

import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔐 Verificar sesión
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/register");
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🔹 Menú solo si hay usuario */}
        {!loading && user && (
          <nav className="bg-gray-100 p-4 flex justify-between items-center shadow">
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-blue-600 font-semibold hover:underline"
              >
                Inicio
              </Link>

              <Link
                href="/mvp"
                className="text-blue-600 font-semibold hover:underline"
              >
                MVP
              </Link>

              <Link
                href="/user"
                className="text-blue-600 font-semibold hover:underline"
              >
                Usuario
              </Link>
            </div>

            {/* 👤 Usuario + Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </nav>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}