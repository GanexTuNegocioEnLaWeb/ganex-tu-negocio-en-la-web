import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const payload = {
      name: String(data?.nombre ?? ""),
      email: String(data?.email ?? ""),
      phone: String(data?.telefono ?? ""),
      company: String(data?.empresa ?? ""),
      message: String(data?.mensaje ?? ""),
      source: "contact_form",
      status: "pending",
    };

    console.log("[Contacto] Nueva solicitud:", payload);

    // Insertar en Supabase (tabla unificada leads)
    const { error } = await supabase.from("leads").insert([payload]);

    if (error) {
      console.error("[Contacto] Error Supabase:", error);
      throw new Error("Error al guardar en base de datos");
    }

    return new Response(
      JSON.stringify({ ok: true, message: "Mensaje recibido", data: payload }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, message: err?.message ?? "Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
