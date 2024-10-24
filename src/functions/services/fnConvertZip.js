import archiver from "archiver";
import streamBuffers from "stream-buffers";
const ZipService = async (data) => {
  try {
    // Crear un buffer de salida para el archivo zip
    const output = new streamBuffers.WritableStreamBuffer();
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Nivel de compresión
    });
    // Escuchar eventos de error
    archive.on("error", function (err) {
      throw err;
    });
    // Pipe de la salida del archivo (output) al archivo de la entrada (archive)
    archive.pipe(output);
    // Añadir cada documento al archivo ZIP
    data.documents.forEach((doc) => {
      const buffer = Buffer.from(doc.content, "base64");
      archive.append(buffer, { name: doc.fileName });
    });
    // Finalizar el archivo (archivar)
    archive.finalize();
    // Escuchar el evento de finalización
    const fbBuffer = new Promise((resolve, reject) => {
      output.on("finish", function () {
        // Obtener el contenido del buffer como base64
        const zipBase64 = output.getContents().toString("base64");
        resolve(zipBase64);
      });
      output.on("error", function (err) {
        reject(err);
      });
    });
    const bufferData = await fbBuffer;
    return bufferData;
  } catch (error) {
    console.log(error);
  }
};
const jsonToB64 = async (json) => {
  try {
    const data = json;
    const ZipServiceReturnData = await ZipService(data);
    return ZipServiceReturnData;
  } catch (error) {
    console.log(error);
  }
};

export default jsonToB64;
