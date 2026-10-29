// jncv (dia 14 src/routes/estudiantes.ts) - 
// Documentacion Swagger UI:
// https://github.com/JCerdanv/????????????.git

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
    // #swagger.description = 'Obtiene la lista de estudiantes'
    /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Obtiene la lista de estudiantes, permitiendo filtrar por el nombre del bootcamp.'
    #swagger.parameters['bootcamp'] = {
        in: 'query',
        description: 'Nombre del bootcamp para filtrar',
        required: false,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Lista de estudiantes recuperada con éxito.',
        schema: { ok: true, total: 1, data: [{ id: 1, nombre: 'jesus cerdan', email: 'inforperu@outlook.com', bootcamp: 'TripleTen Perú' }] }
    }
  */
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
    // #swagger.description = 'Obtiene un estudiante por ID'
    /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Obtiene los detalles de un estudiante específico mediante su ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del estudiante',
        required: true,
        type: 'number'
    }
    #swagger.responses[200] = {
        description: 'Estudiante encontrado.',
        schema: { ok: true, data: { id: 1, nombre: 'jesus cerdan', email: 'inforperu@outlook.com', bootcamp: 'TripleTen Perú' } }
    }
    #swagger.responses[404] = {
        description: 'El estudiante no existe.',
        schema: { ok: false, mensaje: 'El estudiante con ID 1 no existe.' }
    }
   */
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
    // #swagger.description = 'Agrega una lista de estudiantes de manera masiva'
    /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Registra de forma masiva una lista predefinida de estudiantes.'
    #swagger.responses[201] = {
        description: 'Lista de estudiantes agregada con éxito.',
        schema: { ok: true, mensaje: 'Lista de estudiantes agregada con exito.', total: 7, data: [] }
    }
    */
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

// POST - Crear un estudiante individual
router.post("/", (req: Request, res: Response) => {  
  // #swagger.description = 'Crea un nuevo estudiante'  
  // Valida si req.body no existe en lo absoluto
  /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Crea un nuevo estudiante de forma individual.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos requeridos para registrar un estudiante',
        required: true,
        schema: { nombre: 'Juan Pérez', email: 'juan@mail.com', bootcamp: 'Fullstack' }
    }
    #swagger.responses[201] = {
        description: 'Estudiante registrado con éxito.',
        schema: { ok: true, mensaje: 'Estudiante registrado con exito.', data: { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com', bootcamp: 'Fullstack' } }
    }
    #swagger.responses[400] = {
        description: 'Error de validación o cuerpo vacío.',
        schema: { ok: false, mensaje: 'Faltan campos obligatorios (nombre, email y bootcamp).' }
    }
  */
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

// PUT - Intercepta petición PUT sin ID y devuelve el error 400 - Actualizar estudiante
// El signo "?" hace que el parametro sea opcional para controlar su ausencia
router.put("/", (req: Request, res: Response) => {
    /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Punto de control para rechazar solicitudes PUT que no envían ID en la URL.'
    #swagger.responses[400] = {
        description: 'Falta el parámetro ID.',
        schema: { ok: false, mensaje: 'El parámetro ID en metodo PUT es obligatorio en la URL.' }
    }
   */
   return res.status(400).json({
     ok: false,
     mensaje: "El parámetro ID en metodo PUT es obligatorio en la URL."
   });
});

// Para cuando el ID sí viene en la URL - Actualizar estudiante por ID
router.put("/:id", (req: Request, res: Response) => {
      /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Actualiza parcialmente o totalmente las propiedades de un estudiante.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID numérico del estudiante a actualizar',
        required: true,
        type: 'number'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Campos opcionales a modificar',
        required: false,
        schema: { nombre: 'Nombre Editado', email: 'nuevo@mail.com', bootcamp: 'Nuevo Bootcamp' }
    }
    #swagger.responses[200] = {
        description: 'Estudiante actualizado con éxito.',
        schema: { ok: true, mensaje: 'Estudiante actualizado con exito.', data: { id: 1, nombre: 'Nombre Editado', email: 'nuevo@mail.com', bootcamp: 'Nuevo Bootcamp' } }
    }
    #swagger.responses[400] = {
        description: 'El ID enviado en la ruta no es un número válido.',
        schema: { ok: false, mensaje: 'El ID en metodo PUT proporcionado debe ser un numero válido.' }
    }
    #swagger.responses[404] = {
        description: 'No se encontró ningún estudiante con ese ID.',
        schema: { ok: false, mensaje: 'El estudiante con ID en metodo PUT 99 no existe.' }
    }
  */
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


// DELETE - Intercepta petición DELETE sin ID y devuelve el error 400
router.delete("/", (req: Request, res: Response) => {
    /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Punto de control para rechazar solicitudes DELETE que no envían ID en la URL.'
    #swagger.responses[400] = {
        description: 'Falta el parámetro ID.',
        schema: { ok: false, mensaje: 'El parámetro ID en metodo DELETE es obligatorio en la URL.' }
    }
    */
    return res.status(400).json({
      ok: false,
      mensaje: "El parámetro ID en metodo DELETE es obligatorio en la URL."
    });
});


// DELETE - Eliminar estudiante
router.delete("/:id", (req: Request, res: Response) => {
    /* 
    #swagger.tags = ['Estudiantes']
    #swagger.description = 'Elimina de manera permanente un estudiante según su ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID numérico del estudiante a eliminar',
        required: true,
        type: 'number'
    }
    #swagger.responses[200] = {
        description: 'Estudiante eliminado con éxito.',
        schema: { ok: true, mensaje: 'Estudiante eliminado con exito.', data: { id: 1, nombre: 'jesus cerdan', email: 'inforperu@outlook.com', bootcamp: 'TripleTen Perú' } }
    }
    #swagger.responses[404] = {
        description: 'No se encontró ningún estudiante con ese ID.',
        schema: { ok: false, mensaje: 'El estudiante con ID 99 no existe.' }
    }
    */
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

// jncv fin (dia 14 src/routes/estudiantes.ts) - Documentacion Swagger UI
