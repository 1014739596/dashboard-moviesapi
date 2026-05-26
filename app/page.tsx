"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const router = useRouter();

  // 🔐 Verificar sesión
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/register");
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, []);

  // 🎬 Obtener películas
  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await fetch("https://devsapihub.com/api-movies");
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Error cargando películas", error);
      }
    };

    getMovies();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black p-8">
      {/* 👤 Usuario */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          🎬 Películas
        </h1>

        {user && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            👤 {user.email}
          </p>
        )}
      </div>

      {/* 🎥 Películas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <div
            key={movie.id}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform"
          >
            <Image
              src={movie.image}
              alt={movie.title}
              width={400}
              height={500}
              className="w-full h-60 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                {movie.title}
              </h2>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                {movie.description}
              </p>

              <p className="text-sm mt-2 font-medium text-blue-600">
                ⭐ {movie.rating}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}