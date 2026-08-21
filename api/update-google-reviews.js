const PLACE_ID = "ChIJVQmQWyLRYpYRc-0os-pLURU";
const GOOGLE_PLACES_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK = "displayName,rating,userRatingCount,reviews,googleMapsUri";
const FALLBACK_MAPS_URI = "https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9";

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
        "X-Goog-Language-Code": "es"
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
