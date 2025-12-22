import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const { error } = await supabase.from("contactos").insert([
      {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        empresa: data.empresa,
        mensaje: data.mensaje,
      },
    ]);

    if (error) {
      return new Response(
        JSON.stringify({ ok: false, message: "Error al enviar el mensaje" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: "Mensaje enviado correctamente" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, message: "Error del servidor" }),
      { status: 500 }
    );
  }
};
