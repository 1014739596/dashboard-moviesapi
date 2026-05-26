"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// 🧩 Tipo correcto
interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
}

export default function UsuarioPage() {
  // 🧠 ESTADOS
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🚀 Obtener usuario
  const fetchUsuario = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMensaje("⚠️ No hay usuario logueado");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("usuarios") // 🔥 CAMBIO CLAVE
      .select("id, nombre, correo, telefono")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ Error:", error.message);
      setMensaje("❌ No se encontró el usuario");
    } else if (data) {
      setUsuario(data);
      setNombre(data.nombre);
      setTelefono(data.telefono || "");
    }

    setLoading(false);
  };

  // 🚀 Actualizar usuario
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usuario) return;

    const { error } = await supabase
      .from("usuarios") // 🔥 CAMBIO CLAVE
      .update({
        nombre,
        telefono,
      })
      .eq("id", usuario.id);

    if (error) {
      setMensaje("❌ Error al actualizar: " + error.message);
    } else {
      setMensaje("✅ Datos actualizados correctamente");
      fetchUsuario();
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  // ⏳ Loading
  if (loading) {
    return <p className="text-center mt-10">⏳ Cargando...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">
        👤 Mi Perfil
      </h1>

      {usuario ? (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          {/* Nombre */}
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="border p-2 rounded"
          />

          {/* Teléfono */}
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="border p-2 rounded"
          />

          {/* Correo */}
          <input
            type="email"
            value={usuario.correo}
            readOnly
            className="border p-2 rounded bg-gray-100 text-gray-600"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Guardar cambios
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600">{mensaje}</p>
      )}

      {mensaje && (
        <p className="mt-4 text-center text-gray-700 font-medium">
          {mensaje}
        </p>
      )}
    </div>
  );
}