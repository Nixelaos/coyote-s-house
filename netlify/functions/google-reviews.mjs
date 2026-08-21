import { getStore } from "@netlify/blobs";

const BLOB_STORE_NAME = "google-reviews";
const BLOB_KEY = "current";
const FALLBACK_MAPS_URI = "https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9";

/**
 * Endpoint público que entrega el último snapshot de reseñas almacenado en Netlify Blobs.
 * NUNCA llama a Google Places API ni expone credenciales.
 */
export default async (req) => {
  // Manejo de peticiones OPTIONS para CORS si fuera necesario
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  try {
    const store = getStore(BLOB_STORE_NAME);
    const data = await store.get(BLOB_KEY, { type: "json" });

    if (!data) {
      // Si aún no se ha ejecutado la Scheduled Function inicial
      return new Response(
        JSON.stringify({
          status: "pending",
          message: "El snapshot de reseñas aún no está disponible.",
          businessName: "Coyote's House",
          googleMapsUri: FALLBACK_MAPS_URI,
          reviews: []
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=60"
          }
        }
      );
    }

    // Respuesta exitosa con headers de CDN y navegador optimizados
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        // Cache navegador: 1 hora, Cache CDN Netlify: 4 horas, SWR: 24 horas
        "Cache-Control": "public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400",
        "Netlify-CDN-Cache-Control": "public, max-age=14400, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    console.error("[google-reviews] Error al leer snapshot de Netlify Blobs:", error.message);

    return new Response(
      JSON.stringify({
        error: "Error interno al recuperar las reseñas.",
        businessName: "Coyote's House",
        googleMapsUri: FALLBACK_MAPS_URI,
        reviews: []
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store"
        }
      }
    );
  }
};
