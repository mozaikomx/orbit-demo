const { GoogleGenerativeAI } = require("@google/generative-ai");

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
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
  });

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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let jsonText = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const data = JSON.parse(jsonText);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Tracker API error:", err);
    return res.status(500).json({ error: err.message, stack: err.stack, key: !!process.env.GEMINI_API_KEY });
  }
}
