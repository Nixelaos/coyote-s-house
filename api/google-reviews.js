const PLACE_ID = "ChIJVQmQWyLRYpYRc-0os-pLURU";
const GOOGLE_PLACES_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=es`;
const FIELD_MASK = "displayName,rating,userRatingCount,reviews,googleMapsUri";
const FALLBACK_MAPS_URI = "https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9";

/**
 * Traduce cadenas de tiempo relativo en inglés a español como salvaguarda.
 */
function translateRelativeTime(str) {
  if (!str) return "Recientemente";
  const map = [
    [/an? hour ago/i, "hace 1 hora"],
    [/(\d+)\s*hours? ago/i, "hace $1 horas"],
    [/yesterday/i, "ayer"],
    [/a day ago/i, "hace 1 día"],
    [/(\d+)\s*days? ago/i, "hace $1 días"],
    [/a week ago/i, "hace 1 semana"],
    [/(\d+)\s*weeks? ago/i, "hace $1 semanas"],
    [/a month ago/i, "hace 1 mes"],
    [/(\d+)\s*months? ago/i, "hace $1 meses"],
    [/a year ago/i, "hace 1 año"],
    [/(\d+)\s*years? ago/i, "hace $1 años"]
  ];
  let out = str;
  for (const [rx, rep] of map) {
    if (rx.test(out)) return out.replace(rx, rep);
  }
  return out;
}

/**
 * Selecciona el texto en español o en su defecto el texto original.
 */
function extractReviewText(rev) {
  if (rev.originalText?.text && (!rev.originalText?.languageCode || rev.originalText.languageCode === "es")) {
    return rev.originalText.text;
  }
  if (rev.text?.text) {
    return rev.text.text;
  }
  return rev.originalText?.text || "";
}

function normalizePlacesData(raw) {
  const businessName = raw.displayName?.text || "Coyote's House";
  const rating = typeof raw.rating === "number" ? Number(raw.rating.toFixed(1)) : 5.0;
  const userRatingCount = typeof raw.userRatingCount === "number" ? raw.userRatingCount : 0;
  const googleMapsUri = raw.googleMapsUri || FALLBACK_MAPS_URI;

  const MIN_RATING = 3;
  const rawReviews = Array.isArray(raw.reviews) ? raw.reviews : [];
  const normalizedReviews = rawReviews
    .filter((rev) => (typeof rev.rating === "number" ? rev.rating : 5) >= MIN_RATING)
    .slice(0, 5)
    .map((rev) => {
      const author = rev.authorAttribution?.displayName || "Cliente de Coyote's House";
      const authorPhoto = rev.authorAttribution?.photoUri || "";
      const authorUri = rev.authorAttribution?.uri || "";
      const revRating = typeof rev.rating === "number" ? rev.rating : 5;
      const text = extractReviewText(rev);
      const rawRelativeTime = rev.relativePublishTimeDescription || "";
      const relativePublishTime = translateRelativeTime(rawRelativeTime);
      const publishTime = rev.publishTime || "";
      const reviewGoogleMapsUri = rev.googleMapsUri || googleMapsUri;

      return {
        author,
        authorPhoto,
        authorUri,
        rating: revRating,
        text,
        relativePublishTime,
        publishTime,
        googleMapsUri: reviewGoogleMapsUri
      };
    });

  return {
    businessName,
    rating,
    userRatingCount,
    googleMapsUri,
    updatedAt: new Date().toISOString(),
    reviews: normalizedReviews
  };
}

export default async function handler(req, res) {
  // Cabeceras CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 1. Intentar lectura desde Vercel Blob si el token está presente
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { get } = await import("@vercel/blob");
      const blobResult = await get("reviews.json");
      if (blobResult && blobResult.blob) {
        const text = await blobResult.blob.text();
        const data = JSON.parse(text);
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
        return res.status(200).json(data);
      }
    } catch (e) {
      console.warn("[google-reviews] Aviso al leer Vercel Blob:", e.message);
    }
  }

  // 2. Consulta directa a Google Places API con Vercel Edge Network Caching (24 horas)
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("[google-reviews] Variable GOOGLE_PLACES_API_KEY no configurada en Vercel.");
    return res.status(500).json({
      error: "Variable de entorno GOOGLE_PLACES_API_KEY no configurada en Vercel.",
      businessName: "Coyote's House",
      googleMapsUri: FALLBACK_MAPS_URI,
      reviews: []
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(GOOGLE_PLACES_URL, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
        "X-Goog-Language-Code": "es",
        "Accept-Language": "es-CL,es;q=0.9"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[google-reviews] Error de Google Places API HTTP ${response.status}: ${errorText.slice(0, 150)}`);
      return res.status(502).json({
        error: "Error temporal al obtener opiniones de Google.",
        businessName: "Coyote's House",
        googleMapsUri: FALLBACK_MAPS_URI,
        reviews: []
      });
    }

    const rawData = await response.json();
    const normalized = normalizePlacesData(rawData);

    // Cache CDN de Vercel por 24 horas (86400 segundos) y Stale While Revalidate por 24 horas
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
    res.setHeader("CDN-Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");

    return res.status(200).json(normalized);
  } catch (err) {
    console.error("[google-reviews] Error en handler:", err.message);
    return res.status(503).json({
      error: "Servicio de opiniones no disponible momentáneamente.",
      businessName: "Coyote's House",
      googleMapsUri: FALLBACK_MAPS_URI,
      reviews: []
    });
  }
}
