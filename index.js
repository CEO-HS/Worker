export default {
  async fetch(request, env) {
    // Solo aceptar POST
    if (request.method !== "POST") {
      return new Response("Use POST to 

upload files", { status: 400 });
    }

    try {
      const formData = await 

request.formData();
      const files = formData.getAll

("imagenes"); // los archivos subidos
      let urls = [];

      for (const file of files) {
        const name = file.name;
        const arrayBuffer = await 

file.arrayBuffer();

        // Subir a R2
        await fetch(`https://

${env.R2_ACCOUNT_ID}.r2.cloudflarestora

ge.com/${name}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer 

${env.R2_API_TOKEN}`,
            "Content-Type": file.type
          },
          body: arrayBuffer
        });

        // Guardar URL pública
        urls.push(`https://

${env.R2_ACCOUNT_ID}.r2.cloudflarestora

ge.com/${name}`);
      }

      // Respuesta JSON con URLs
      return new Response

(JSON.stringify({ success: true, urls 

}), {
        headers: { "Content-Type": 

"application/json" }
      });

    } catch (err) {
      return new Response

(JSON.stringify({ success: false, 

error: err.message }), {
        status: 500,
        headers: { "Content-Type": 

"application/json" }
      });
    }
  }
};
