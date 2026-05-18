const { createClient } = require("@supabase/supabase-js");

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

export default async function handler(req, res) {
  const supabase = getSupabase();

  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      const { data, error } = await supabase
        .from("actores_guardados")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return res.status(404).json({ error: error.message });
      return res.status(200).json(data);
    }

    const { data, error } = await supabase
      .from("actores_guardados")
      .select("id, nombre, perfil, profundidad, created_at")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { nombre, perfil, nodos, conexiones, investigacion, profundidad } = req.body;
    if (!nombre) return res.status(400).json({ error: "nombre es requerido" });

    const { data, error } = await supabase
      .from("actores_guardados")
      .insert([{ nombre, perfil, nodos, conexiones, investigacion, profundidad: String(profundidad) }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "id es requerido" });

    const { error } = await supabase
      .from("actores_guardados")
      .delete()
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
