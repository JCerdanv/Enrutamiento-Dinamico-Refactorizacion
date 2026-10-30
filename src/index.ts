// jncv (dia 14 archivo src/index.ts) - - Documentacion Swagger UI: 
// https://github.com/JCerdanv/????????????.git
// http://localhost:3000/api-docs


// import express from "express";
import express from 'express';
import estudiantesRouter from "./routes/estudiantes";

import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';

const app = express();
const PORT = 3000;

// middleware normal para JSON
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Middleware para capturar errores de parseo de JSON (Exceptuando ...)
app.use((err: any, req: any, res: any, next: any) => {
  // Si es GET DELETE POST si no continuamos
  if (req.method === 'GET' || req.method === 'DELETE' || req.method === 'POST') {
    return next();
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      ok: false,
      mensaje: "El cuerpo de la petición no es un JSON válido o está vacío."
    });
  }
  next();
})

// Monta rutas bajo el prefijo /api/estudiantes
app.use("/api/estudiantes", estudiantesRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(PORT, () => {
  console.log(`\ndia 14 - Documentacion Swagger UI: `);
  console.log(`http://localhost:3000/api-docs`);
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});

// jncv fin (dia 14 src/index.ts) - Enrutamiento Dinámico y Refactorización