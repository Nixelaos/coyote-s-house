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
  // Validación de seguridad para Cron de Vercel si CRON_SECRET está definido
  if (process.env.CRON_SECRET) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GOOGLE_PLACES_API_KEY" });
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
      throw new Error(`Google Places API respondió con HTTP ${response.status}`);
    }

    const raw = await response.json();
    const data = normalizePlacesData(raw);

    // Si Vercel Blob está conectado, persistir snapshot
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      await put("reviews.json", JSON.stringify(data), {
        access: "public",
        addRandomSuffix: false
      });
    }

    return res.status(200).json({
      success: true,
      updatedAt: data.updatedAt,
      reviewsCount: data.reviews.length,
      rating: data.rating,
      userRatingCount: data.userRatingCount
    });
  } catch (err) {
    console.error("[update-google-reviews] Error:", err.message);
    return res.status(502).json({
      success: false,
      error: err.message
    });
  }
}
