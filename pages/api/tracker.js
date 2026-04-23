const { GoogleGenerativeAI } = require("@google/generative-ai");

async function callWithRetry(model, prompt, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonText = jsonMatch ? jsonMatch[1].trim() : text;
      return JSON.parse(jsonText);
    } catch (err) {
      console.error(`Attempt ${i + 1} failed:`, err.message);
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nombre, profundidad = 15 } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: "nombre es requerido" });
  }
  const nodos = parseInt(profundidad) || 15;

  console.log("KEY:", !!process.env.GEMINI_API_KEY);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY no configurada" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
Eres un analista político especializado en actores de influencia en México.
Investiga al actor: "${nombre}"

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin bloques de código, sin explicaciones extra) con la siguiente estructura exacta:

{
  "perfil": {
    "nombre": "nombre completo del actor",
    "cargo": "cargo actual o más relevante",
    "partido": "partido político si aplica, sino null",
    "descripcion": "descripción de 2-3 oraciones sobre el actor y su relevancia política",
    "tags": ["etiqueta1", "etiqueta2", "etiqueta3"]
  },
  "nodos": [
    { "id": "id_unico_snake_case", "label": "Nombre o institución", "tipo": "Persona|Gobierno|Empresa|ONG", "dominio": "sitio web oficial sin https (ej: itam.mx)" }
  ],
  "conexiones": [
    { "source": "id_fuente", "target": "id_destino", "tipo": "etiqueta corta que describa la relación, máximo 4 palabras, primera letra en mayúscula, sin preposiciones al final (nunca terminar en 'en', 'de', 'por', 'a', 'con')" }
  ]
}

Reglas:
- El actor investigado debe aparecer como primer nodo con id "actor_principal"
- Incluye exactamente ${nodos} nodos relevantes (personas, instituciones, empresas, organizaciones vinculadas al actor)
- Incluye entre ${nodos} y ${nodos + 5} conexiones que muestren las relaciones
- Los tipos de nodo solo pueden ser: Persona, Gobierno, Empresa, ONG
- Para nodos de tipo Gobierno, Empresa y ONG: "dominio" debe ser el sitio web oficial sin https (ej: "pemex.com", "ine.mx"). Para tipo Persona: "dominio" debe ser null
- Las conexiones deben usar los IDs definidos en los nodos
- No incluyas nodos sin conexión
`;

  const toolConfig = { tools: [{ googleSearch: {} }] };

  // Try gemini-2.5-flash first, then fall back to gemini-1.5-flash
  for (const modelName of ["gemini-2.5-flash", "gemini-1.5-flash"]) {
    const model = genAI.getGenerativeModel({ model: modelName, ...toolConfig });
    const data = await callWithRetry(model, prompt, 3);
    if (data) {
      console.log(`Success with ${modelName}`);
      return res.status(200).json(data);
    }
    console.warn(`${modelName} exhausted, trying next model`);
  }

  return res.status(503).json({
    error: "high_demand",
    message: "El servicio está experimentando alta demanda. Intenta de nuevo en unos segundos.",
  });
}
