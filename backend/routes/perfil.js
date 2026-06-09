const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const prisma = new PrismaClient();

// GET /api/perfil/direcciones
router.get('/direcciones', authMiddleware, roleMiddleware('colaborador'), asyncHandler(async (req, res) => {
  const direcciones = await prisma.direccionEnvio.findMany({
    where: { colaboradorId: req.user.colaboradorId },
    orderBy: [{ predeterminada: 'desc' }, { createdAt: 'asc' }],
  });
  res.json(direcciones);
}));

// POST /api/perfil/direcciones
router.post('/direcciones', authMiddleware, roleMiddleware('colaborador'), asyncHandler(async (req, res) => {
  const { alias, calle, numero, depto, comuna, ciudad, region, codigoPostal, predeterminada } = req.body;
  const colaboradorId = req.user.colaboradorId;

  if (!alias || !calle || !numero || !comuna || !ciudad || !region)
    return res.status(400).json({ error: 'Alias, calle, número, comuna, ciudad y región son obligatorios' });

  if (predeterminada) {
    await prisma.direccionEnvio.updateMany({
      where: { colaboradorId },
      data: { predeterminada: false },
    });
  }

  const count = await prisma.direccionEnvio.count({ where: { colaboradorId } });
  const direccion = await prisma.direccionEnvio.create({
    data: {
      colaboradorId,
      alias, calle, numero,
      depto: depto || null,
      comuna, ciudad, region,
      codigoPostal: codigoPostal || null,
      predeterminada: predeterminada || count === 0,
    },
  });
  res.status(201).json(direccion);
}));

// PUT /api/perfil/direcciones/:id
router.put('/direcciones/:id', authMiddleware, roleMiddleware('colaborador'), asyncHandler(async (req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const { id } = req.params;

  const existe = await prisma.direccionEnvio.findFirst({ where: { id, colaboradorId } });
  if (!existe) return res.status(404).json({ error: 'Dirección no encontrada' });

  const { alias, calle, numero, depto, comuna, ciudad, region, codigoPostal, predeterminada } = req.body;

  if (predeterminada) {
    await prisma.direccionEnvio.updateMany({
      where: { colaboradorId },
      data: { predeterminada: false },
    });
  }

  const direccion = await prisma.direccionEnvio.update({
    where: { id },
    data: { alias, calle, numero, depto: depto || null, comuna, ciudad, region, codigoPostal: codigoPostal || null, predeterminada: predeterminada || false },
  });
  res.json(direccion);
}));

// DELETE /api/perfil/direcciones/:id
router.delete('/direcciones/:id', authMiddleware, roleMiddleware('colaborador'), asyncHandler(async (req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const { id } = req.params;

  const existe = await prisma.direccionEnvio.findFirst({ where: { id, colaboradorId } });
  if (!existe) return res.status(404).json({ error: 'Dirección no encontrada' });

  await prisma.direccionEnvio.delete({ where: { id } });

  // Si era predeterminada, asignar la más antigua como nueva predeterminada
  if (existe.predeterminada) {
    const siguiente = await prisma.direccionEnvio.findFirst({
      where: { colaboradorId },
      orderBy: { createdAt: 'asc' },
    });
    if (siguiente) {
      await prisma.direccionEnvio.update({ where: { id: siguiente.id }, data: { predeterminada: true } });
    }
  }

  res.json({ message: 'Dirección eliminada' });
}));

module.exports = router;
