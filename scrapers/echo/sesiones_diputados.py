#!/usr/bin/env python3
"""
Scraper: Convocatorias de sesiones — Gaceta de la Cámara de Diputados
Fuente: https://gaceta.diputados.gob.mx/  (frame: gp_hoy.html)
Inserta/actualiza en tabla `sesiones` de Supabase.

Estatus válidos en BD: "Programada" | "Cancelada" | "Reprogramada"
"En progreso" y "Concluida" se calculan en el frontend.
"""

import re
import warnings
from datetime import date, datetime
from pathlib import Path
import os

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

warnings.filterwarnings("ignore", message="Unverified HTTPS request")

# ── Credenciales ────────────────────────────────────────────────────────────────
env_path = Path(__file__).resolve().parents[2] / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

BASE_URL   = "https://gaceta.diputados.gob.mx"
FUENTE_URL = "https://gaceta.diputados.gob.mx/"
HOY_URL    = f"{BASE_URL}/gp_hoy.html"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

MESES = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4,
    "mayo": 5, "junio": 6, "julio": 7, "agosto": 8,
    "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12,
}

# ── Patrones de estatus ─────────────────────────────────────────────────────────
# "Cancelada": sesión anulada definitivamente
_RE_CANCELADA = re.compile(
    r"se cancela|queda cancelada|ha sido cancelada",
    re.IGNORECASE,
)

# "Reprogramada": sesión movida o sin nueva fecha confirmada
_RE_REPROGRAMADA = re.compile(
    r"se pospone|hasta nuevo aviso|cambi[oó] de fecha|cambio de fecha"
    r"|cambi[oó] de horario|cambio de horario|se reprograma|se difiere",
    re.IGNORECASE,
)

# Subconjunto de reprogramada que sí trae nueva fecha/horario explícita
_RE_NUEVA_FECHA = re.compile(
    r"cambi[oó] de fecha|cambio de fecha|cambi[oó] de horario|cambio de horario",
    re.IGNORECASE,
)


# ── Helpers HTTP ────────────────────────────────────────────────────────────────

def get_soup(url: str) -> BeautifulSoup:
    resp = requests.get(url, headers=HEADERS, verify=False, timeout=20)
    resp.raise_for_status()
    resp.encoding = resp.apparent_encoding or "utf-8"
    return BeautifulSoup(resp.text, "html.parser")


def _sb_headers(extra: dict | None = None) -> dict:
    h = {
        "apikey":        SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type":  "application/json",
    }
    if extra:
        h.update(extra)
    return h


# ── Helpers de fecha/hora ───────────────────────────────────────────────────────

def _fechas_en_texto(texto: str, anio: int) -> list[str]:
    """Devuelve todas las fechas ISO encontradas en el texto, en orden de aparición."""
    texto_l = texto.lower()
    hits: list[tuple[int, str]] = []

    # "23 de abril de 2026"
    for m in re.finditer(
        r"(\d{1,2})\s+de\s+(" + "|".join(MESES) + r")\s+de\s+(\d{4})",
        texto_l,
    ):
        iso = f"{int(m.group(3)):04d}-{MESES[m.group(2)]:02d}-{int(m.group(1)):02d}"
        hits.append((m.start(), iso))

    covered = {pos for pos, _ in hits}

    # "23 de abril" (sin año)
    for m in re.finditer(
        r"(\d{1,2})\s+de\s+(" + "|".join(MESES) + r")(?!\s+de\s+\d{4})",
        texto_l,
    ):
        if not any(abs(m.start() - c) < 4 for c in covered):
            iso = f"{anio:04d}-{MESES[m.group(2)]:02d}-{int(m.group(1)):02d}"
            hits.append((m.start(), iso))

    hits.sort(key=lambda x: x[0])
    return [iso for _, iso in hits]


def parse_fecha(texto: str, anio: int) -> str:
    fechas = _fechas_en_texto(texto, anio)
    return fechas[0] if fechas else date.today().isoformat()


def parse_hora(texto: str) -> str | None:
    m = re.search(r"las?\s+(\d{1,2}):(\d{2})\s*(?:hrs?\.?|horas?)?", texto, re.IGNORECASE)
    if m:
        return f"{int(m.group(1)):02d}:{m.group(2)}"
    m2 = re.search(r"(\d{1,2}):(\d{2})\s*(?:hrs?\.?|horas?)?", texto, re.IGNORECASE)
    if m2:
        return f"{int(m2.group(1)):02d}:{m2.group(2)}"
    return None


# ── Clasificación de estatus ────────────────────────────────────────────────────

def clasificar_estatus(bloque: str) -> str:
    """
    Devuelve el estatus a guardar en BD basado en palabras clave del texto.
    "En progreso" y "Concluida" NO se guardan — se calculan en frontend.
    """
    if _RE_CANCELADA.search(bloque):
        return "Cancelada"
    if _RE_REPROGRAMADA.search(bloque):
        return "Reprogramada"
    return "Programada"


def extraer_fecha_nueva(bloque: str, anio: int) -> tuple[str | None, str | None]:
    """
    Para entradas con 'cambio de fecha/horario': busca la nueva fecha y hora
    en el segmento de texto que sigue a la palabra clave.
    Retorna (nueva_fecha_iso, nueva_hora_HH:MM) o (None, None).
    """
    m_kw = _RE_NUEVA_FECHA.search(bloque)
    if not m_kw:
        return None, None
    post = bloque[m_kw.end():]
    fechas = _fechas_en_texto(post, anio)
    return (fechas[0] if fechas else None), parse_hora(post)


# ── Scraping ────────────────────────────────────────────────────────────────────

def extraer_anio_gaceta(soup: BeautifulSoup) -> int:
    texto = soup.get_text(" ", strip=True)[:500]
    m = re.search(r"\b(202\d)\b", texto)
    return int(m.group(1)) if m else date.today().year


def bloque_texto(ancla_inicio, ancla_fin) -> str:
    """Texto plano entre dos anclas HTML consecutivas."""
    textos = []
    node = ancla_inicio.find_next()
    while node and node != ancla_fin:
        if hasattr(node, "get_text"):
            t = node.get_text(" ", strip=True)
            if t:
                textos.append(t)
        node = node.find_next()
    return " ".join(textos)


def extraer_titulo(bloque: str) -> str:
    """
    De "A la decimocuarta reunión ordinaria, que se llevará a cabo..."
    extrae "Decimocuarta reunión ordinaria".
    """
    m = re.search(
        r"[Aa]\s+la\s+(.+?(?:reuni[oó]n|sesi[oó]n)\s*"
        r"(?:ordinaria|extraordinaria|de\s+junta\s+directiva|de\s+trabajo)?)",
        bloque,
        re.IGNORECASE,
    )
    if m:
        t = m.group(1).strip().rstrip(",")
        return t[0].upper() + t[1:]
    corte = re.split(r",?\s+que\s+se", bloque, maxsplit=1)[0].strip()
    return corte[:200]


def detectar_tipo(comision: str, titulo: str) -> str:
    if "pleno" in (comision + titulo).lower() and "comisi" not in (comision + titulo).lower():
        return "Pleno"
    return "Comisión"


def extraer_convocatorias(soup: BeautifulSoup) -> list[dict]:
    anio = extraer_anio_gaceta(soup)

    anclas = [
        a for a in soup.find_all("a", attrs={"name": True})
        if re.match(r"Convocatoria\d+", a.get("name", ""))
    ]
    fin_seccion = soup.find("a", attrs={"name": "Invitaciones"})

    sesiones: list[dict] = []

    for i, ancla in enumerate(anclas):
        ancla_fin = anclas[i + 1] if i + 1 < len(anclas) else fin_seccion
        bloque = bloque_texto(ancla, ancla_fin)

        m_com = re.match(
            r"De\s+(?:la\s+|el\s+)?(.+?)(?:\s+[Aa]\s+la\s+|\s+[Aa]\s+el\s+|$)",
            bloque,
            re.IGNORECASE,
        )
        comision = m_com.group(1).strip() if m_com else "Sin determinar"
        titulo   = extraer_titulo(bloque)
        estatus  = clasificar_estatus(bloque)

        # fecha = fecha original de la sesión referenciada (sirve para buscar en BD)
        fecha = parse_fecha(bloque, anio)
        hora  = parse_hora(bloque)

        entrada: dict = {
            "titulo":     titulo,
            "comision":   comision,
            "fecha":      fecha,
            "hora":       hora,
            "foro":       "Cámara de Diputados",
            "tipo":       detectar_tipo(comision, titulo),
            "fuente_url": FUENTE_URL,
            "estatus":    estatus,
        }

        # Datos privados solo para reprogramación con nueva fecha (no se envían a Supabase)
        if estatus == "Reprogramada":
            fecha_nueva, hora_nueva = extraer_fecha_nueva(bloque, anio)
            entrada["_fecha_nueva"] = fecha_nueva
            entrada["_hora_nueva"]  = hora_nueva

        sesiones.append(entrada)

    return sesiones


# ── Operaciones Supabase ────────────────────────────────────────────────────────

def buscar_sesion(comision: str, titulo: str, fecha: str) -> dict | None:
    """Busca una sesión por comision + titulo + fecha. Retorna la fila o None."""
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/sesiones",
        params={
            "comision": f"eq.{comision}",
            "titulo":   f"eq.{titulo}",
            "fecha":    f"eq.{fecha}",
            "select":   "id,estatus",
            "limit":    "1",
        },
        headers=_sb_headers(),
        timeout=15,
    )
    if resp.status_code == 200:
        data = resp.json()
        return data[0] if data else None
    return None


def actualizar_estatus(record_id: int, estatus: str) -> bool:
    """PATCH estatus de un registro existente. Nunca borra filas."""
    resp = requests.patch(
        f"{SUPABASE_URL}/rest/v1/sesiones?id=eq.{record_id}",
        json={"estatus": estatus},
        headers=_sb_headers({"Prefer": "return=minimal"}),
        timeout=15,
    )
    return resp.status_code in (200, 204)


def upsert_sesiones(sesiones: list[dict]) -> int:
    """
    Inserta solo los registros que aún no existen en BD (dedup por titulo+fecha).
    No requiere unique constraint en la tabla.
    """
    if not sesiones:
        return 0

    # Obtener pares (titulo, fecha) existentes para filtrar antes de insertar
    resp_get = requests.get(
        f"{SUPABASE_URL}/rest/v1/sesiones",
        params={"select": "titulo,fecha"},
        headers=_sb_headers(),
        timeout=15,
    )
    existentes: set[tuple[str, str]] = set()
    if resp_get.status_code == 200:
        for row in resp_get.json():
            existentes.add((row["titulo"], row["fecha"]))

    nuevas = [s for s in sesiones if (s["titulo"], s["fecha"]) not in existentes]

    if not nuevas:
        print("  (todos los registros ya existen en BD — nada nuevo que insertar)")
        return 0

    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/sesiones",
        json=nuevas,
        headers=_sb_headers({"Prefer": "return=representation"}),
        timeout=30,
    )
    if resp.status_code not in (200, 201):
        print(f"  [!] Error Supabase {resp.status_code}: {resp.text[:400]}")
        return 0
    try:
        return len(resp.json())
    except Exception:
        return len(nuevas)


# ── Main ────────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("SCRAPER — Convocatorias Gaceta Cámara de Diputados")
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    print(f"\n[1/3] Descargando {HOY_URL} ...")
    soup = get_soup(HOY_URL)
    print("  OK")

    print("\n[2/3] Extrayendo convocatorias...")
    sesiones = extraer_convocatorias(soup)
    print(f"  Encontradas: {len(sesiones)}")

    if not sesiones:
        print("\n  No hay convocatorias en la Gaceta de hoy.")
        return

    # ── Clasificar y procesar ───────────────────────────────────────────────────
    print("\n  Detalle:")
    a_insertar:    list[dict] = []  # registros "Programada" nuevos/actualizados
    n_actualizados: int = 0

    for s in sesiones:
        estatus = s["estatus"]
        etiqueta = f"[{estatus}] {s['titulo'][:50]}"

        if estatus == "Programada":
            row = {k: v for k, v in s.items() if not k.startswith("_")}
            a_insertar.append(row)
            print(f"  + {etiqueta}")
            print(f"    Comisión: {s['comision'][:55]}")
            print(f"    Fecha   : {s['fecha']}  Hora: {s['hora'] or 'N/D'}  Tipo: {s['tipo']}")

        elif estatus in ("Cancelada", "Reprogramada"):
            print(f"  ~ {etiqueta}")
            print(f"    Comisión: {s['comision'][:55]}")
            print(f"    Fecha   : {s['fecha']}  Hora: {s['hora'] or 'N/D'}")

            existing = buscar_sesion(s["comision"], s["titulo"], s["fecha"])
            if existing:
                ok = actualizar_estatus(existing["id"], estatus)
                status_str = "OK" if ok else "ERROR"
                print(f"    → {status_str} actualizado id={existing['id']} a '{estatus}'")
                if ok:
                    n_actualizados += 1
            else:
                print(f"    [!] No encontrado en BD — se omite actualización")

            # Si hay nueva fecha explícita, también insertar nuevo registro "Programada"
            if estatus == "Reprogramada" and s.get("_fecha_nueva"):
                nueva_fila = {
                    "titulo":     s["titulo"],
                    "comision":   s["comision"],
                    "fecha":      s["_fecha_nueva"],
                    "hora":       s.get("_hora_nueva") or s["hora"],
                    "foro":       s["foro"],
                    "tipo":       s["tipo"],
                    "fuente_url": FUENTE_URL,
                    "estatus":    "Programada",
                }
                a_insertar.append(nueva_fila)
                print(f"    + Nueva fecha programada: {s['_fecha_nueva']} {s.get('_hora_nueva') or ''}")

    # ── Guardar en Supabase ─────────────────────────────────────────────────────
    print(f"\n[3/3] Guardando en Supabase...")
    n_upsert = upsert_sesiones(a_insertar)
    print(f"  Programadas insertadas/actualizadas : {n_upsert}")
    print(f"  Estatus actualizados (Patch)         : {n_actualizados}")
    print("\nListo.")


if __name__ == "__main__":
    main()
