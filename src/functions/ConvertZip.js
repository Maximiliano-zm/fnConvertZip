import fnConvertZip from "./services/fnConvertZip.js";
import { app } from "@azure/functions";
app.http("convertZip", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const json = request.query.get("json") || (await request.json());
      const respuesta = await fnConvertZip(json);
      if (!respuesta) {
        return { status: 400, jsonBody: { error: "Error al convertir a ZIP" } };
      } else {
        return { body: respuesta };
      }
    } catch (error) {
      console.error("Error en convertZip endpoint:", error);
      return { status: 500, jsonBody: { error: "Error interno del servidor" } };
    }
  },
});
export default app;
