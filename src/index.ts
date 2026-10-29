// jncv (dia 13 src/index.ts) - Enrutamiento Dinámico y Refactorización
// https://github.com/JCerdanv/Enrutamiento-Dinamico-Refactorizacion.git
// http://localhost:3000/api/estudiantes

import express from "express";
import estudiantesRouter from "./routes/estudiantes";

const app = express();
const PORT = 3000;

// middleware normal para JSON
app.use(express.json());

// Middleware para capturar errores de parseo de JSON (Exceptuando ...)
app.use((err: any, req: any, res: any, next: any) => {
  // Si es GET DELETE POST si no continuamos
  if (req.method === "GET" || req.method === "DELETE"|| req.method === "POST") {
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

app.listen(PORT, () => {
  console.log(`\ndia 13 - Enrutamiento Dinámico y Refactorización`);
  console.log(`ThunderCliente http://localhost:3000/api/estudiantes`);
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});

// jncv fin (dia 13 src/index.ts) - Enrutamiento Dinámico y Refactorización