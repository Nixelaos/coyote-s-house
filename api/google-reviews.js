const PLACE_ID = "ChIJVQmQWyLRYpYRc-0os-pLURU";
const GOOGLE_PLACES_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK = "displayName,rating,userRatingCount,reviews,googleMapsUri";
const FALLBACK_MAPS_URI = "https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9";

function normalizePlacesData(raw) {
  const businessName = raw.displayName?.text || "Coyote's House";
  const rating = typeof raw.rating === "number" ? Number(raw.rating.toFixed(1)) : 5.0;
  const userRatingCount = typeof raw.userRatingCount === "number" ? raw.userRatingCount : 0;
  const googleMapsUri = raw.googleMapsUri || FALLBACK_MAPS_URI;

  const rawReviews = Array.isArray(raw.reviews) ? raw.reviews : [];
  const normalizedReviews = rawReviews.slice(0, 5).map((rev) => {
    const author = rev.authorAttribution?.displayName || "Cliente de Coyote's House";
    const authorPhoto = rev.authorAttribution?.photoUri || "";
    const authorUri = rev.authorAttribution?.uri || "";
    const revRating = typeof rev.rating === "number" ? rev.rating : 5;
    const text = rev.text?.text || rev.originalText?.text || "";
    const relativePublishTime = rev.relativePublishTimeDescription || "";
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
        "X-Goog-Language-Code": "es"
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
