const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OpenAI } = require("openai");

export const config = {
  maxDuration: 120,
};

const GEMINI_JSON_MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash-latest"];

async function callGeminiJSON(genAI, prompt) {
  for (const modelName of GEMINI_JSON_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.error(`Gemini JSON error (${modelName}):`, err.message);
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

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey) return res.status(500).json({ error: "GEMINI_API_KEY no configurada" });
  if (!openaiKey) return res.status(500).json({ error: "OPENAI_API_KEY no configurada" });

  const genAI = new GoogleGenerativeAI(geminiKey);
  const openai = new OpenAI({ apiKey: openaiKey });

  // Paso 1 — Investigación con OpenAI gpt-4o + web search
  let investigacion;
  try {
    const responseInvestigacion = await openai.responses.create({
      model: "gpt-4o",
      tools: [{ type: "web_search_preview" }],
      input: `Eres un analista de inteligencia especializado en mapear actores de influencia en México.
Investiga exhaustivamente a: "${nombre}"

Estructura el reporte con estas secciones usando ## para los títulos:
## Identificación y Formación Académica
## Trayectoria Profesional y Cargos
## Afiliación Política e Ideológica
## Relaciones Clave
## Contexto Actual y Relevancia
## Controversias e Investigaciones Relevantes
## Fuentes consultadas

Usa **negrita** para nombres propios y datos importantes.
Para cada afirmación importante cita la fuente inline con formato [texto](url).
Al final en ## Fuentes consultadas lista TODAS las fuentes numeradas: [N] Título — Medio — URL

Mínimo 400 palabras. No incluyas campos como Fecha:, Analista:, Clasificación: al inicio.`,
    });
    investigacion = responseInvestigacion.output_text;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return res.status(503).json({
      error: "high_demand",
      message: "El servicio está experimentando alta demanda. Intenta de nuevo en unos segundos.",
    });
  }

  if (!investigacion) {
    return res.status(503).json({
      error: "high_demand",
      message: "El servicio está experimentando alta demanda. Intenta de nuevo en unos segundos.",
    });
  }

  // Paso 2 — JSON con Gemini 1.5 Flash (sin tools, solo estructurar)
  const promptJSON = `
Basándote en la siguiente investigación sobre "${nombre}", genera un JSON de red de influencia.

INVESTIGACIÓN:
${investigacion}

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin bloques de código, sin explicaciones extra) con la siguiente estructura exacta:

{
  "perfil": {
    "nombre": "nombre completo del actor",
    "cargo": "cargo actual o más relevante, o giro principal si es empresa/institución",
    "partido": "partido político si aplica, sino null",
    "descripcion": "descripción de 2-3 oraciones sobre el actor y su relevancia en México"
  },
  "nodos": [
    { "id": "id_unico_snake_case", "label": "nombre completo de la institución o persona, nunca abreviado ni cortado (ej: 'Cámara de Diputados' no 'Cámara de', 'Secretaría de Gobernación' no 'Secretaría de', 'Universidad Panamericana' no 'Universidad de')", "tipo": "Persona|Gobierno|Empresa|Sociedad Civil", "dominio": "sitio web oficial sin https (ej: itam.mx)" }
  ],
  "conexiones": [
    {
      "source": "id_fuente",
      "target": "id_destino",
      "tipo": "etiqueta corta que describa la relación, máximo 4 palabras, primera letra en mayúscula, sin preposiciones al final (nunca terminar en 'en', 'de', 'por', 'a', 'con')",
      "fuente_titulo": "título corto del artículo o medio que respalda esta relación",
      "fuente_url": "URL exacta tomada de la investigación que respalda esta relación, null si no hay"
    }
  ]
}

Reglas:
- El actor investigado debe aparecer como primer nodo con id "actor_principal"
- Incluye exactamente ${nodos} nodos relevantes (personas, instituciones, empresas, organizaciones vinculadas al actor)
- Incluye entre ${nodos} y ${nodos + 5} conexiones que muestren las relaciones
- Los tipos de nodo solo pueden ser: Persona, Gobierno, Empresa, Sociedad Civil
- Para nodos de tipo Gobierno, Empresa y Sociedad Civil: "dominio" debe ser el sitio web oficial sin https (ej: "pemex.com", "ine.mx"). Para tipo Persona: "dominio" debe ser null
- Las conexiones deben usar los IDs definidos en los nodos
- No incluyas nodos sin conexión
- El campo "partido" es null si el actor no tiene afiliación político-partidista
- Para cada conexión, busca en la investigación proporcionada la fuente más relevante que respalde esa relación y úsala en fuente_titulo y fuente_url. Solo usa URLs que aparezcan en la investigación, nunca inventes URLs.
`;

  const text = await callGeminiJSON(genAI, promptJSON);

  if (!text) {
    return res.status(503).json({
      error: "high_demand",
      message: "El servicio está experimentando alta demanda. Intenta de nuevo en unos segundos.",
    });
  }

  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonText = jsonMatch ? jsonMatch[1].trim() : text;
    const data = JSON.parse(jsonText);
    data.investigacion = investigacion;
    return res.status(200).json(data);
  } catch (err) {
    console.error("JSON parse error:", err.message, "Raw text:", text.slice(0, 200));
    return res.status(503).json({
      error: "high_demand",
      message: "El servicio está experimentando alta demanda. Intenta de nuevo en unos segundos.",
    });
  }
}
