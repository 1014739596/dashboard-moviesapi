"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  // 🔥 REGISTRO
  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    const userId = data.user?.id;

    if (userId) {
      await supabase.from("usuarios").insert([
        {
          id: userId,
          nombre,
          correo: email,
          telefono,
        },
      ]);
    }

    // 🔥 login automático
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    router.push("/");
  };

  // 🔥 LOGIN
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    router.push("/");
  };

  // 🔥 SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-black">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-center text-zinc-900 dark:text-white">
          {isLogin ? "Iniciar sesión" : "Registrarse"}
        </h1>

        {/* 👤 SOLO EN REGISTRO */}
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
              required
            />

            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="border p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            />
          </>
        )}

        {/* 📧 EMAIL */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
          required
        />

        {/* 🔑 PASSWORD */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
          required
        />

        {/* 🔘 BOTÓN */}
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          {isLogin ? "Ingresar" : "Registrarse"}
        </button>

        {/* 🔁 CAMBIO LOGIN / REGISTER */}
        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
            }}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </span>
        </p>

        {/* 📢 MENSAJE */}
        {message && (
          <p className="text-center text-sm text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
}