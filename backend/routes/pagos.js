const express = require('express');
const router = express.Router();
const { WebpayPlus, Environment } = require('transbank-sdk');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const prisma = new PrismaClient();

const tx = new WebpayPlus.Transaction(new (require('transbank-sdk').Options)(
  WebpayPlus.commerceCode,
  WebpayPlus.apiKey,
  Environment.Integration
));

// POST /api/pagos/iniciar
router.post('/iniciar', authMiddleware, roleMiddleware('colaborador'), asyncHandler(async (req, res) => {
  const { items, direccionId } = req.body;
  const { colaboradorId } = req.user;

  if (!items || items.length === 0)
    return res.status(400).json({ error: 'No hay productos en el carrito' });

  // Validar dirección
  if (direccionId) {
    const dir = await prisma.direccionEnvio.findFirst({ where: { id: direccionId, colaboradorId } });
    if (!dir) return res.status(400).json({ error: 'Dirección no válida' });
  }

  // Validar stock y límites antes de iniciar pago
  for (const item of items) {
    const producto = await prisma.producto.findUnique({ where: { id: item.productoId } });
    if (!producto || producto.stock <= 0)
      return res.status(400).json({ error: `Sin stock: ${item.nombre}` });

    const yaCompro = await prisma.compra.findFirst({
      where: { colaboradorId, productoId: item.productoId, estado: { not: 'cancelada' } },
    });
    if (yaCompro)
      return res.status(400).json({ error: `Ya compraste: ${producto.nombre}` });
  }

  const total = items.reduce((s, i) => s + i.precioEvento, 0);
  const buyOrder = `NX-${Date.now()}`;
  const sessionId = `${colaboradorId}-${Date.now()}`;
  const returnUrl = `${process.env.FRONTEND_URL}/pago/resultado`;

  const response = await tx.create(buyOrder, sessionId, total, returnUrl);

  // Guardar contexto en DB temporalmente usando un campo JSON en sesión (usamos un modelo temporal simple)
  // Por simplicidad guardamos los datos en la URL de retorno como query params no sensibles
  // Los datos reales se validan al confirmar con el token

  res.json({
    url: response.url,
    token: response.token,
    buyOrder,
    // Pasamos metadata para que el frontend pueda enviarla al confirmar
    metadata: { items, direccionId: direccionId || null, total },
  });
}));

// POST /api/pagos/confirmar
router.post('/confirmar', authMiddleware, roleMiddleware('colaborador'), asyncHandler(async (req, res) => {
  const { token_ws, items, direccionId } = req.body;
  const { colaboradorId } = req.user;

  if (!token_ws) return res.status(400).json({ error: 'Token de pago requerido' });
  if (!items || items.length === 0) return res.status(400).json({ error: 'No hay productos' });

  // Confirmar con Transbank
  let tbkResponse;
  try {
    tbkResponse = await tx.commit(token_ws);
  } catch (e) {
    return res.status(400).json({ error: 'Error al confirmar pago con Transbank', detalle: e.message });
  }

  // Validar que el pago fue aprobado
  if (tbkResponse.response_code !== 0) {
    return res.status(400).json({
      error: 'Pago rechazado',
      response_code: tbkResponse.response_code,
      status: tbkResponse.status,
    });
  }

  // Registrar compras en DB
  const comprasCreadas = [];
  for (const item of items) {
    try {
      const producto = await prisma.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || producto.stock <= 0) continue;

      const yaCompro = await prisma.compra.findFirst({
        where: { colaboradorId, productoId: item.productoId, estado: { not: 'cancelada' } },
      });
      if (yaCompro) continue;

      const compra = await prisma.$transaction(async (tx) => {
        const nueva = await tx.compra.create({
          data: {
            colaboradorId,
            productoId: item.productoId,
            eventoId: item.eventoId || null,
            monto: producto.precioEvento,
            estado: 'completada',
          },
          include: { producto: true },
        });
        await tx.producto.update({ where: { id: item.productoId }, data: { stock: { decrement: 1 } } });
        await tx.colaborador.update({ where: { id: colaboradorId }, data: { puntos: { increment: Math.floor(producto.precioEvento / 1000) } } });
        return nueva;
      });

      comprasCreadas.push(compra);
    } catch (e) {
      console.error('Error registrando compra:', e.message);
    }
  }

  res.json({
    ok: true,
    compras: comprasCreadas,
    transbank: {
      buy_order: tbkResponse.buy_order,
      amount: tbkResponse.amount,
      status: tbkResponse.status,
      authorization_code: tbkResponse.authorization_code,
      card_detail: tbkResponse.card_detail,
      transaction_date: tbkResponse.transaction_date,
    },
  });
}));

module.exports = router;
