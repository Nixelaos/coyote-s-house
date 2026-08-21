import { getStore } from "@netlify/blobs";

const PLACE_ID = "ChIJVQmQWyLRYpYRc-0os-pLURU";
const GOOGLE_PLACES_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK = "displayName,rating,userRatingCount,reviews,googleMapsUri";
const BLOB_STORE_NAME = "google-reviews";
const BLOB_KEY = "current";
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Realiza la petición a Google Places API (New) con timeout y reintento único para errores de red/5xx.
 */
async function fetchGooglePlacesData(apiKey, attempt = 1) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
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
      const errorStatus = response.status;

      // Reintento para errores transitorios de servidor (5xx)
      if (errorStatus >= 500 && attempt < 2) {
        console.warn(`[update-google-reviews] Error HTTP ${errorStatus} de Google. Reintentando en 1.5s...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return fetchGooglePlacesData(apiKey, attempt + 1);
      }

      throw new Error(`Google Places API responded with HTTP status ${errorStatus}: ${errorText.slice(0, 200)}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);

    // Reintento para timeout o errores de conexión
    if (attempt < 2 && (err.name === "AbortError" || err.code === "ECONNRESET")) {
      console.warn(`[update-google-reviews] Fallo de conexión (${err.message}). Reintentando en 1.5s...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return fetchGooglePlacesData(apiKey, attempt + 1);
    }

    throw err;
  }
}

/**
 * Normaliza el payload de Google Places API (New) a una estructura limpia e independiente.
 */
function normalizePlacesData(raw) {
  const businessName = raw.displayName?.text || "Coyote's House";
  const rating = typeof raw.rating === "number" ? Number(raw.rating.toFixed(1)) : 5.0;
  const userRatingCount = typeof raw.userRatingCount === "number" ? raw.userRatingCount : 0;
  const googleMapsUri = raw.googleMapsUri || "https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9";

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

/**
 * Handler principal de la Scheduled Function
 */
export default async (req) => {
  console.log(`[update-google-reviews] Iniciando sincronización de reseñas de Google Maps: ${new Date().toISOString()}`);

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("[update-google-reviews] ERROR: La variable de entorno GOOGLE_PLACES_API_KEY no está configurada.");
    return new Response(
      JSON.stringify({ error: "Missing GOOGLE_PLACES_API_KEY environment variable" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const rawData = await fetchGooglePlacesData(apiKey);
    const normalizedData = normalizePlacesData(rawData);

    // Guardar en Netlify Blobs
    const store = getStore(BLOB_STORE_NAME);
    await store.setJSON(BLOB_KEY, normalizedData);

    console.log(
      `[update-google-reviews] Snapshot actualizado con éxito en Blobs. Negocio: "${normalizedData.businessName}", Rating: ${normalizedData.rating} (${normalizedData.userRatingCount} reseñas), ${normalizedData.reviews.length} reseñas almacenadas.`
    );

    return new Response(
      JSON.stringify({
        success: true,
        updatedAt: normalizedData.updatedAt,
        reviewsCount: normalizedData.reviews.length,
        rating: normalizedData.rating,
        userRatingCount: normalizedData.userRatingCount
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Si Google falla, preservamos el snapshot anterior y registramos el error sin filtrar secretos
    console.error(`[update-google-reviews] Error al consultar Google Places API: ${error.message}`);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to update reviews from Google Places API. Existing blob was preserved.",
        timestamp: new Date().toISOString()
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Configuración de ejecución programada diaria
 */
export const config = {
  schedule: "@daily"
};
