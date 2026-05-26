"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// 🧩 Tipo flexible
interface Movie {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  poster?: string;
  img?: string;
}

// 🧩 Tipo BD
interface ObjetoMVP {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
}

export default function MVPPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [misPeliculas, setMisPeliculas] = useState<ObjetoMVP[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // 🎬 Obtener películas API
  const fetchMovies = async () => {
    const res = await fetch("https://devsapihub.com/api-movies");
    const data = await res.json();

    console.log("API Movies:", data); // 👈 debug útil

    setMovies(data);
  };

  // ❤️ Obtener mis películas
  const fetchMisPeliculas = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("objetos_mvp")
      .select("*")
      .eq("usuario_id", user.id)
      .order("creado_en", { ascending: false });

    if (!error) setMisPeliculas(data || []);
  };

  // 🧠 Obtener imagen correcta (CLAVE 🔥)
  const getImage = (movie: any) => {
    return (
      movie.image ||
      movie.poster ||
      movie.img ||
      movie.image_url ||
      "https://via.placeholder.com/300x400?text=No+Image"
    );
  };

  // ❤️ Guardar película
  const guardarPelicula = async (movie: Movie) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMensaje("⚠️ Debes iniciar sesión");
      return;
    }

    const imagenCorrecta = getImage(movie); // 👈 CLAVE

    const { error } = await supabase.from("objetos_mvp").insert([
      {
        usuario_id: user.id,
        titulo: movie.title || "Sin título",
        descripcion: movie.description || "Sin descripción",
        imagen_url: imagenCorrecta, // 👈 GUARDA BIEN LA IMAGEN
      },
    ]);

    if (error) {
      setMensaje("❌ Error al guardar: " + error.message);
    } else {
      setMensaje("✅ Película guardada");
      fetchMisPeliculas();
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchMisPeliculas();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎬 MVP Películas
      </h1>

      {/* 🎬 API */}
      <h2 className="text-xl font-semibold mb-4">
        Películas disponibles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {movies.map((movie, index) => (
          <div key={movie.id || index} className="border p-3 rounded shadow">
            {/* 🖼 IMAGEN CORREGIDA */}
            <img
              src={getImage(movie)}
              alt={movie.title || "Película"}
              className="w-full h-48 object-cover rounded"
            />

            <h3 className="font-bold mt-2">
              {movie.title || "Sin título"}
            </h3>

            <p className="text-sm">
              {movie.description || "Sin descripción"}
            </p>

            <button
              onClick={() => guardarPelicula(movie)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              ❤️ Guardar
            </button>
          </div>
        ))}
      </div>

      {/* 📢 Mensaje */}
      {mensaje && <p className="text-center mt-4">{mensaje}</p>}

      {/* ❤️ MIS PELÍCULAS */}
      <h2 className="text-xl font-semibold mt-10 mb-4">
        Mis películas guardadas
      </h2>

      {misPeliculas.length === 0 ? (
        <p>No has guardado películas aún</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {misPeliculas.map((pelicula) => (
            <div key={pelicula.id} className="border p-3 rounded shadow">
              <img
                src={
                  pelicula.imagen_url ||
                  "https://via.placeholder.com/300x400?text=No+Image"
                }
                alt={pelicula.titulo}
                className="w-full h-48 object-cover rounded"
              />

              <h3 className="font-bold mt-2">{pelicula.titulo}</h3>

              <p className="text-sm">{pelicula.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}