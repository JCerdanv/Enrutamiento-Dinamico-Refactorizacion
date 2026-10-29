// jncv (dia 13 src/routes/estudiantes.ts) - 
// Enrutamiento Dinámico y Refactorización
// https://github.com/JCerdanv/Enrutamiento-Dinamico-Refactorizacion.git

import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

const estudiantes: Estudiante[] = [];
let proximoId = 1;

// GET - Obtener todos los estudiantes (Soporta filtrado por bootcamp vía query string)
router.get("/", (req: Request, res: Response) => {
  const { bootcamp } = req.query;

  if (bootcamp) {
    const filtrados = estudiantes.filter(
      (e) => e.bootcamp.toLowerCase() === String(bootcamp).toLowerCase()
    );
    return res.status(200).json({
      ok: true,
      total: filtrados.length,
      data: filtrados,
    });
  }

  res.status(200).json({
    ok: true,
    total: estudiantes.length,
    data: estudiantes,
  });
});

// GET - Obtener un estudiante por ID
router.get("/:id", (req: Request, res: Response) => {
  const idBuscado = Number(req.params.id);
  const estudiante = estudiantes.find((e) => e.id === idBuscado);

  if (!estudiante) {
    return res.status(404).json({
      ok: false,
      mensaje: `El estudiante con ID ${idBuscado} no existe.`,
    });
  }

  res.status(200).json({
    ok: true,
    data: estudiante,
  });
});

// POST - Crear lista de estudiantes masiva
router.post("/agrega", (req: Request, res: Response) => {
  const nuevosEstudiantes: Estudiante[] = [
    { id: proximoId++, nombre: "jesus cerdan", email: "inforperu@outlook.com", bootcamp: "TripleTen Perú" },
    { id: proximoId++, nombre: "alberto perez", email: "albertop@cclam.org", bootcamp: "Le Wagon Lima" },
    { id: proximoId++, nombre: "maria guevara", email: "mague@hotmail.com", bootcamp: "Le Wagon Lima" },
    { id: proximoId++, nombre: "nolberto gonzales", email: "ngonza@gmail.com", bootcamp: "TripleTen Perú" },
    { id: proximoId++, nombre: "pedro llontop", email: "pllontop@yahoo.es", bootcamp: "CodiGo" },
    { id: proximoId++, nombre: "karla vargas", email: "karvar@pepsico.pe", bootcamp: "Le Wagon Lima" },
    { id: proximoId++, nombre: "marco silva", email: "pepsico.pe", bootcamp: "Le Wagon Lima" }
  ];

  // Agregar la lista al arreglo global 'estudiantes'
  estudiantes.push(...nuevosEstudiantes);

  res.status(201).json({
    ok: true,
    mensaje: "Lista de estudiantes agregada con exito.",
    total: estudiantes.length,
    data: estudiantes
  });
});

router.post("/", (req: Request, res: Response) => {
  // Valida si req.body no existe en lo absoluto
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El cuerpo de la petición no puede estar vacío.",
    });
  }

  const { nombre, email, bootcamp } = req.body;

  if (!nombre || !email || !bootcamp) {
    return res.status(400).json({
      ok: false,
      mensaje: "Faltan campos obligatorios (nombre, email y bootcamp).",
    });
  }

  const nuevoEstudiante: Estudiante = {
    id: proximoId++,
    nombre,
    email,
    bootcamp,
  };

  estudiantes.push(nuevoEstudiante);

  res.status(201).json({
    ok: true,
    mensaje: "Estudiante registrado con exito.",
    data: nuevoEstudiante,
  });
});


// PUT - Actualizar estudiante
// El signo "?" hace que el parametro sea opcional para controlar su ausencia

// Intercepta peticion PUT sin ID y devuelve el error 400
router.put("/", (req: Request, res: Response) => {
  return res.status(400).json({
    ok: false,
    mensaje: "El parámetro ID en metodo PUT es obligatorio en la URL."
  });
});

// Para cuando el ID sí viene en la URL
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idBuscado = Number(id);

  // Valida que sea un numero válido (NaN control)
  if (isNaN(idBuscado)) {
    return res.status(400).json({
      ok: false,
      mensaje: "El ID en metodo PUT proporcionado debe ser un numero válido."
    });
  }

  const { nombre, email, bootcamp } = req.body;
  const indice = estudiantes.findIndex((e) => e.id === idBuscado);

  // Valida si el estudiante existe
  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: `El estudiante con ID en metodo PUT ${idBuscado} no existe.`
    });
  }

  // Actualiza los campos (mantiene los anteriores si vienen vacíos)
  estudiantes[indice] = {
    id: idBuscado,
    nombre: nombre || estudiantes[indice].nombre,
    email: email || estudiantes[indice].email,
    bootcamp: bootcamp || estudiantes[indice].bootcamp,
  };

  // Envia la respuesta de exito
  res.status(200).json({
    ok: true,
    mensaje: "Estudiante actualizado con exito.",
    data: estudiantes[indice],
  });
});


// Intercepta peticion DELETE sin ID y devuelve el error 400
router.delete("/", (req: Request, res: Response) => {
  return res.status(400).json({
    ok: false,
    mensaje: "El parámetro ID en metodo DELETE es obligatorio en la URL."
  });
});

// DELETE - Eliminar estudiante
router.delete("/:id", (req: Request, res: Response) => {
  const idBuscado = Number(req.params.id);
  const indice = estudiantes.findIndex((e) => e.id === idBuscado);

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: `El estudiante con ID ${idBuscado} no existe.`,
    });
  }

  const [estudianteEliminado] = estudiantes.splice(indice, 1);

  res.status(200).json({
    ok: true,
    mensaje: "Estudiante eliminado con exito.",
    data: estudianteEliminado,
  });
});

export default router;

// jncv fin (dia 13 src/routes/estudiantes.ts) - Enrutamiento Dinámico y Refactorización
