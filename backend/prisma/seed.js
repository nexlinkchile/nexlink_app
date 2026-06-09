const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.direccionEnvio.deleteMany();
  await prisma.compra.deleteMany();
  await prisma.eventoEmpresa.deleteMany();
  await prisma.user.deleteMany();
  await prisma.colaborador.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.empresa.deleteMany();

  const hash = await bcrypt.hash('password', 10);

  // ─── Empresas ─────────────────────────────────────────────────────────────
  const empresas = await Promise.all([
    prisma.empresa.create({ data: {
      id: 'e1', nombre: 'Banco de Chile', rut: '97.006.000-6', industria: 'Banca y Finanzas',
      logo: 'BC', contactoRRHH: 'Roberto Fuentes', emailRRHH: 'rrhh@bancochile.cl',
      telefono: '+56 2 2637 1111', totalColaboradores: 8500, colaboradoresActivos: 4230,
      estado: 'activo', plan: 'enterprise', fechaIngreso: new Date('2024-01-10'),
      dominiosPermitidos: ['bancochile.cl'],
      eventosParticipados: 15, comprasTotales: 38200000, ahorroColaboradores: 14600000, satisfaccion: 92,
    }}),
    prisma.empresa.create({ data: {
      id: 'e2', nombre: 'Entel', rut: '92.580.000-7', industria: 'Telecomunicaciones',
      logo: 'EN', contactoRRHH: 'Valeria Morales', emailRRHH: 'rrhh@entel.cl',
      telefono: '+56 2 2340 2000', totalColaboradores: 5200, colaboradoresActivos: 2890,
      estado: 'activo', plan: 'premium', fechaIngreso: new Date('2024-02-01'),
      dominiosPermitidos: ['entel.cl'],
      eventosParticipados: 10, comprasTotales: 22400000, ahorroColaboradores: 8900000, satisfaccion: 88,
    }}),
    prisma.empresa.create({ data: {
      id: 'e3', nombre: 'Samsung Chile', rut: '96.645.020-4', industria: 'Tecnología',
      logo: 'SC', contactoRRHH: 'Carolina López', emailRRHH: 'rrhh@samsung.cl',
      telefono: '+56 2 2345 6789', totalColaboradores: 3200, colaboradoresActivos: 1800,
      estado: 'activo', plan: 'premium', fechaIngreso: new Date('2024-01-15'),
      dominiosPermitidos: ['samsung.cl', 'samsung.com'],
      eventosParticipados: 8, comprasTotales: 45200000, ahorroColaboradores: 18000000, satisfaccion: 95,
    }}),
    prisma.empresa.create({ data: {
      id: 'e4', nombre: 'Falabella', rut: '76.023.310-3', industria: 'Retail',
      logo: 'FA', contactoRRHH: 'Ana González', emailRRHH: 'rrhh@falabella.cl',
      telefono: '+56 2 2380 0000', totalColaboradores: 12000, colaboradoresActivos: 6100,
      estado: 'activo', plan: 'enterprise', fechaIngreso: new Date('2024-02-20'),
      dominiosPermitidos: ['falabella.cl', 'falabella.com'],
      eventosParticipados: 12, comprasTotales: 82400000, ahorroColaboradores: 32000000, satisfaccion: 91,
    }}),
    prisma.empresa.create({ data: {
      id: 'e5', nombre: 'Cencosud', rut: '93.834.000-5', industria: 'Retail',
      logo: 'CS', contactoRRHH: 'Jorge Álvarez', emailRRHH: 'rrhh@cencosud.cl',
      telefono: '+56 2 2959 0000', totalColaboradores: 15000, colaboradoresActivos: 7800,
      estado: 'activo', plan: 'enterprise', fechaIngreso: new Date('2024-03-01'),
      dominiosPermitidos: ['cencosud.cl'],
      eventosParticipados: 18, comprasTotales: 95600000, ahorroColaboradores: 38000000, satisfaccion: 94,
    }}),
    prisma.empresa.create({ data: {
      id: 'e6', nombre: 'Latam Airlines', rut: '89.862.200-2', industria: 'Aviación',
      logo: 'LA', contactoRRHH: 'Sofía Vera', emailRRHH: 'rrhh@latam.com',
      telefono: '+56 2 2565 3000', totalColaboradores: 4800, colaboradoresActivos: 2100,
      estado: 'activo', plan: 'premium', fechaIngreso: new Date('2024-03-15'),
      dominiosPermitidos: ['latam.com'],
      eventosParticipados: 6, comprasTotales: 18900000, ahorroColaboradores: 7200000, satisfaccion: 87,
    }}),
  ]);

  console.log('✅ Empresas creadas');

  // ─── Colaboradores ────────────────────────────────────────────────────────
  await prisma.colaborador.createMany({
    data: [
      { id: 'c1', empresaId: 'e1', nombre: 'María Fernández', email: 'maria@bancochile.cl', cargo: 'Analista Senior', area: 'Tecnología', rut: '15.234.567-8', telefono: '+56 9 8765 4321', estado: 'activo', puntos: 1240 },
      { id: 'c2', empresaId: 'e1', nombre: 'Carlos Rojas', email: 'carlos.rojas@bancochile.cl', cargo: 'Ejecutivo Comercial', area: 'Ventas', rut: '14.567.890-1', telefono: '+56 9 7654 3210', estado: 'activo', puntos: 2100 },
      { id: 'c3', empresaId: 'e1', nombre: 'Valentina Muñoz', email: 'valentina.munoz@bancochile.cl', cargo: 'Gerenta de Proyectos', area: 'Tecnología', rut: '17.234.567-9', telefono: '+56 9 6543 2109', estado: 'activo', puntos: 560 },
      { id: 'c4', empresaId: 'e1', nombre: 'Andrés Sepúlveda', email: 'asepulveda@bancochile.cl', cargo: 'Ingeniero de Software', area: 'Tecnología', rut: '16.123.456-7', telefono: '+56 9 5432 1098', estado: 'activo', puntos: 890 },
      { id: 'c5', empresaId: 'e1', nombre: 'Camila Torres', email: 'ctorres@bancochile.cl', cargo: 'Analista de Datos', area: 'Tecnología', rut: '18.234.567-0', telefono: '+56 9 4321 0987', estado: 'activo', puntos: 340 },
      { id: 'c6', empresaId: 'e2', nombre: 'Pedro Soto', email: 'pedro@entel.cl', cargo: 'Ingeniero de Redes', area: 'Operaciones', rut: '16.789.012-3', telefono: '+56 9 3210 9876', estado: 'activo', puntos: 890 },
      { id: 'c7', empresaId: 'e2', nombre: 'Roberto Castro', email: 'r.castro@entel.cl', cargo: 'Técnico Especialista', area: 'Soporte', rut: '18.901.234-5', telefono: '+56 9 2109 8765', estado: 'activo', puntos: 340 },
      { id: 'c8', empresaId: 'e2', nombre: 'Daniela Herrera', email: 'd.herrera@entel.cl', cargo: 'Product Manager', area: 'Producto', rut: '19.012.345-6', telefono: '+56 9 1098 7654', estado: 'activo', puntos: 1560 },
      { id: 'c9', empresaId: 'e3', nombre: 'Felipe Morales', email: 'f.morales@samsung.cl', cargo: 'Sales Manager', area: 'Ventas', rut: '15.678.901-2', telefono: '+56 9 0987 6543', estado: 'activo', puntos: 720 },
      { id: 'c10', empresaId: 'e4', nombre: 'Isabella Contreras', email: 'i.contreras@falabella.cl', cargo: 'Diseñadora UX', area: 'Digital', rut: '17.890.123-4', telefono: '+56 9 9876 5432', estado: 'activo', puntos: 430 },
      { id: 'c11', empresaId: 'e5', nombre: 'Sebastián Vega', email: 's.vega@cencosud.cl', cargo: 'Jefe de Operaciones', area: 'Operaciones', rut: '16.345.678-9', telefono: '+56 9 8765 4321', estado: 'activo', puntos: 1890 },
      { id: 'c12', empresaId: 'e6', nombre: 'Antonia Ramos', email: 'a.ramos@latam.com', cargo: 'Piloto Comercial', area: 'Operaciones Vuelo', rut: '15.456.789-0', telefono: '+56 9 7654 3210', estado: 'activo', puntos: 2450 },
    ],
  });

  console.log('✅ Colaboradores creados');

  // ─── Usuarios ─────────────────────────────────────────────────────────────
  await prisma.user.createMany({
    data: [
      { id: 'u1', nombre: 'Admin NexLink', email: 'admin@nexlink.cl', password: hash, rol: 'admin', avatar: 'AN', emailVerificado: true },
      { id: 'u2', nombre: 'Roberto Fuentes', email: 'rrhh@bancochile.cl', password: hash, rol: 'empresa', empresaId: 'e1', avatar: 'RF', emailVerificado: true },
      { id: 'u3', nombre: 'Valeria Morales', email: 'rrhh@entel.cl', password: hash, rol: 'empresa', empresaId: 'e2', avatar: 'VM', emailVerificado: true },
      { id: 'u4', nombre: 'Carolina López', email: 'rrhh@samsung.cl', password: hash, rol: 'empresa', empresaId: 'e3', avatar: 'CL', emailVerificado: true },
      { id: 'u5', nombre: 'Ana González', email: 'rrhh@falabella.cl', password: hash, rol: 'empresa', empresaId: 'e4', avatar: 'AG', emailVerificado: true },
      { id: 'u6', nombre: 'Jorge Álvarez', email: 'rrhh@cencosud.cl', password: hash, rol: 'empresa', empresaId: 'e5', avatar: 'JA', emailVerificado: true },
      { id: 'u7', nombre: 'Sofía Vera', email: 'rrhh@latam.com', password: hash, rol: 'empresa', empresaId: 'e6', avatar: 'SV', emailVerificado: true },
      { id: 'u8', nombre: 'María Fernández', email: 'maria@bancochile.cl', password: hash, rol: 'colaborador', empresaId: 'e1', colaboradorId: 'c1', avatar: 'MF', emailVerificado: true },
      { id: 'u9', nombre: 'Pedro Soto', email: 'pedro@entel.cl', password: hash, rol: 'colaborador', empresaId: 'e2', colaboradorId: 'c6', avatar: 'PS', emailVerificado: true },
      { id: 'u10', nombre: 'Felipe Morales', email: 'f.morales@samsung.cl', password: hash, rol: 'colaborador', empresaId: 'e3', colaboradorId: 'c9', avatar: 'FM', emailVerificado: true },
      { id: 'u11', nombre: 'Sebastián Vega', email: 's.vega@cencosud.cl', password: hash, rol: 'colaborador', empresaId: 'e5', colaboradorId: 'c11', avatar: 'SV', emailVerificado: true },
      { id: 'u12', nombre: 'Antonia Ramos', email: 'a.ramos@latam.com', password: hash, rol: 'colaborador', empresaId: 'e6', colaboradorId: 'c12', avatar: 'AR', emailVerificado: true },
    ],
  });

  console.log('✅ Usuarios creados');

  // ─── Eventos ──────────────────────────────────────────────────────────────
  await prisma.evento.createMany({
    data: [
      { id: 'ev1', empresaId: 'e3', nombre: 'Samsung Tech Flash #9', descripcion: 'Descuentos exclusivos de hasta 45% en los mejores productos Samsung. Televisores, tablets, smartphones y más.', banner: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80', fechaInicio: new Date('2024-11-10T09:00:00'), fechaFin: new Date('2024-11-13T23:59:59'), estado: 'activo', destacado: true, tipo: 'flash', maxComprasPorColaborador: 2, totalVisitas: 2840, totalCompras: 512, montoTotal: 198400000, colaboradoresUnicos: 1028 },
      { id: 'ev2', empresaId: 'e4', nombre: 'Falabella Moda & Hogar', descripcion: 'Liquidación de temporada en moda, hogar y electrodomésticos. Hasta 50% de descuento en miles de productos.', banner: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80', fechaInicio: new Date('2024-11-08T09:00:00'), fechaFin: new Date('2024-11-16T23:59:59'), estado: 'activo', destacado: true, tipo: 'flash', maxComprasPorColaborador: 3, totalVisitas: 4210, totalCompras: 1291, montoTotal: 124800000, colaboradoresUnicos: 2340 },
      { id: 'ev3', empresaId: 'e5', nombre: 'Cencosud Gourmet Week', descripcion: 'Semana especial con los mejores productos gourmet, vinos premium y alimentos de alta gama.', banner: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80', fechaInicio: new Date('2024-11-20T09:00:00'), fechaFin: new Date('2024-11-25T23:59:59'), estado: 'proximo', destacado: true, tipo: 'flash', maxComprasPorColaborador: 5 },
      { id: 'ev4', empresaId: 'e6', nombre: 'Latam Travel Benefits', descripcion: 'Beneficios exclusivos en pasajes, upgrades y servicios premium para colaboradores.', banner: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80', fechaInicio: new Date('2024-12-01T09:00:00'), fechaFin: new Date('2024-12-05T23:59:59'), estado: 'proximo', destacado: false, tipo: 'flash', maxComprasPorColaborador: 2 },
      { id: 'ev5', empresaId: 'e3', nombre: 'Samsung Back to School', descripcion: 'Notebooks, tablets y accesorios Samsung para el regreso a clases.', banner: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&q=80', fechaInicio: new Date('2024-07-15T09:00:00'), fechaFin: new Date('2024-07-18T23:59:59'), estado: 'finalizado', destacado: false, tipo: 'flash', maxComprasPorColaborador: 1, totalVisitas: 3100, totalCompras: 645, montoTotal: 189200000, colaboradoresUnicos: 1290 },
      { id: 'ev6', empresaId: 'e4', nombre: 'Falabella Invierno Flash', descripcion: 'Lo mejor de la moda de invierno con descuentos de hasta 60%.', banner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80', fechaInicio: new Date('2024-06-10T09:00:00'), fechaFin: new Date('2024-06-13T23:59:59'), estado: 'finalizado', destacado: false, tipo: 'flash', maxComprasPorColaborador: 3, totalVisitas: 2890, totalCompras: 934, montoTotal: 87600000, colaboradoresUnicos: 1560 },
    ],
  });

  await prisma.eventoEmpresa.createMany({
    data: [
      { eventoId: 'ev1', empresaId: 'e1' }, { eventoId: 'ev1', empresaId: 'e2' },
      { eventoId: 'ev1', empresaId: 'e4' }, { eventoId: 'ev1', empresaId: 'e5' }, { eventoId: 'ev1', empresaId: 'e6' },
      { eventoId: 'ev2', empresaId: 'e1' }, { eventoId: 'ev2', empresaId: 'e2' },
      { eventoId: 'ev2', empresaId: 'e3' }, { eventoId: 'ev2', empresaId: 'e6' },
      { eventoId: 'ev3', empresaId: 'e1' }, { eventoId: 'ev3', empresaId: 'e2' },
      { eventoId: 'ev3', empresaId: 'e3' }, { eventoId: 'ev3', empresaId: 'e4' },
      { eventoId: 'ev4', empresaId: 'e1' }, { eventoId: 'ev4', empresaId: 'e2' },
      { eventoId: 'ev4', empresaId: 'e3' }, { eventoId: 'ev4', empresaId: 'e5' },
      { eventoId: 'ev5', empresaId: 'e1' }, { eventoId: 'ev5', empresaId: 'e2' }, { eventoId: 'ev5', empresaId: 'e4' },
      { eventoId: 'ev6', empresaId: 'e1' }, { eventoId: 'ev6', empresaId: 'e2' }, { eventoId: 'ev6', empresaId: 'e5' },
    ],
  });

  console.log('✅ Eventos creados');

  // ─── Productos ────────────────────────────────────────────────────────────
  await prisma.producto.createMany({
    data: [
      // Samsung
      { id: 'p1', empresaId: 'e3', eventoId: 'ev1', nombre: 'Smart TV Samsung 65" Neo QLED 4K', descripcion: 'Televisor Neo QLED con tecnología Mini LED, HDR10+ y procesador Neural Quantum.', categoria: 'Electrónica', precioOriginal: 1299990, precioEvento: 779990, descuento: 40, stock: 30, stockMinimo: 3, imagen: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80', estado: 'activo', sku: 'SAM-TV65-NEO-001', condicion: 'nuevo', tags: ['televisor', '4K', 'QLED'], visitas: 4200 },
      { id: 'p2', empresaId: 'e3', eventoId: 'ev1', nombre: 'Samsung Galaxy S24 Ultra 256GB', descripcion: 'Smartphone insignia con S Pen integrado, cámara de 200MP y Snapdragon 8 Gen 3.', categoria: 'Electrónica', precioOriginal: 999990, precioEvento: 649990, descuento: 35, stock: 25, stockMinimo: 3, imagen: 'https://images.unsplash.com/photo-1707210050240-d733cf91ade5?w=800&q=80', estado: 'activo', sku: 'SAM-S24U-256-002', condicion: 'nuevo', tags: ['smartphone', 'S Pen', 'premium'], visitas: 5800 },
      { id: 'p3', empresaId: 'e3', eventoId: 'ev1', nombre: 'Samsung Galaxy Tab S9 FE', descripcion: 'Tablet con pantalla TFT 10.9", procesador Exynos 1380 y S Pen incluido.', categoria: 'Electrónica', precioOriginal: 499990, precioEvento: 299990, descuento: 40, stock: 40, stockMinimo: 5, imagen: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80', estado: 'activo', sku: 'SAM-TAB-S9FE-003', condicion: 'nuevo', tags: ['tablet', 'Android'], visitas: 3100 },
      { id: 'p4', empresaId: 'e3', eventoId: 'ev1', nombre: 'Samsung Soundbar HW-Q990C', descripcion: 'Barra de sonido 11.1.4ch con Dolby Atmos y tecnología SpaceFit Sound+.', categoria: 'Electrónica', precioOriginal: 799990, precioEvento: 479990, descuento: 40, stock: 15, stockMinimo: 2, imagen: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80', estado: 'activo', sku: 'SAM-SB-Q990-004', condicion: 'nuevo', tags: ['audio', 'soundbar'], visitas: 2100 },
      { id: 'p5', empresaId: 'e3', eventoId: 'ev1', nombre: 'Monitor Samsung Odyssey G7 27"', descripcion: 'Monitor gaming curvo QLED 2K 240Hz con tiempo de respuesta de 1ms.', categoria: 'Electrónica', precioOriginal: 599990, precioEvento: 369990, descuento: 38, stock: 20, stockMinimo: 3, imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', estado: 'activo', sku: 'SAM-MON-G7-005', condicion: 'nuevo', tags: ['monitor', 'gaming'], visitas: 2800 },
      // Falabella
      { id: 'p6', empresaId: 'e4', eventoId: 'ev2', nombre: 'Juego de Living 3 Piezas Premium', descripcion: 'Sofá de 3 cuerpos + 2 sillones tapizados en tela antimanchas.', categoria: 'Hogar', precioOriginal: 599990, precioEvento: 349990, descuento: 42, stock: 12, stockMinimo: 2, imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', estado: 'activo', sku: 'FAL-LIV-3P-001', condicion: 'nuevo', tags: ['muebles', 'living'], visitas: 3400 },
      { id: 'p7', empresaId: 'e4', eventoId: 'ev2', nombre: 'Chaqueta North Face Thermoball', descripcion: 'Chaqueta acolchada con relleno sintético Thermoball, ideal para temperaturas bajo cero.', categoria: 'Moda', precioOriginal: 149990, precioEvento: 74990, descuento: 50, stock: 60, stockMinimo: 10, imagen: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', estado: 'activo', sku: 'FAL-NF-THERM-002', condicion: 'nuevo', tags: ['moda', 'outdoor'], visitas: 4100 },
      { id: 'p8', empresaId: 'e4', eventoId: 'ev2', nombre: 'Robot Aspirador Roomba i7+', descripcion: 'Aspirador robot con vaciado automático, navegación inteligente y control por app.', categoria: 'Hogar', precioOriginal: 499990, precioEvento: 299990, descuento: 40, stock: 18, stockMinimo: 2, imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', estado: 'activo', sku: 'FAL-ROOM-I7-003', condicion: 'nuevo', tags: ['electrodoméstico', 'robot'], visitas: 5200 },
      { id: 'p9', empresaId: 'e4', eventoId: 'ev2', nombre: 'Cafetera Nespresso Vertuo Next', descripcion: 'Cafetera de cápsulas con tecnología Centrifusion para cafés perfectos.', categoria: 'Hogar', precioOriginal: 89990, precioEvento: 49990, descuento: 44, stock: 85, stockMinimo: 10, imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', estado: 'activo', sku: 'FAL-NESP-VN-004', condicion: 'nuevo', tags: ['cocina', 'café'], visitas: 6800 },
      { id: 'p10', empresaId: 'e4', eventoId: 'ev2', nombre: 'Zapatillas Nike Air Max 270', descripcion: 'Zapatillas lifestyle con cámara de aire Max de 270° para máxima comodidad.', categoria: 'Moda', precioOriginal: 99990, precioEvento: 59990, descuento: 40, stock: 120, stockMinimo: 15, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', estado: 'activo', sku: 'FAL-NIK-AM270-005', condicion: 'nuevo', tags: ['zapatillas', 'Nike'], visitas: 7200 },
      // Cencosud
      { id: 'p11', empresaId: 'e5', eventoId: 'ev3', nombre: 'Pack Vinos Premium Santa Rita 6 botellas', descripcion: 'Selección de 6 vinos premium de la línea Medalla Real de Santa Rita.', categoria: 'Alimentos', precioOriginal: 89990, precioEvento: 59990, descuento: 33, stock: 200, stockMinimo: 20, imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', estado: 'activo', sku: 'CEN-VIN-SR-001', condicion: 'nuevo', tags: ['vinos', 'gourmet'], visitas: 1200 },
      { id: 'p12', empresaId: 'e5', eventoId: 'ev3', nombre: 'Parrilla Weber Master-Touch 57cm', descripcion: 'Parrilla a carbón premium con tapa y sistema de ventilación.', categoria: 'Hogar', precioOriginal: 249990, precioEvento: 164990, descuento: 34, stock: 35, stockMinimo: 5, imagen: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', estado: 'activo', sku: 'CEN-WEB-MT57-002', condicion: 'nuevo', tags: ['parrilla', 'premium'], visitas: 890 },
      // Latam
      { id: 'p13', empresaId: 'e6', eventoId: 'ev4', nombre: 'Upgrade Business Class Latam', descripcion: 'Upgrade a Business Class en vuelos nacionales e internacionales seleccionados.', categoria: 'Otro', precioOriginal: 199990, precioEvento: 99990, descuento: 50, stock: 100, stockMinimo: 10, imagen: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80', estado: 'activo', sku: 'LAT-UPG-BC-001', condicion: 'nuevo', tags: ['viaje', 'business'], visitas: 3400 },
    ],
  });

  console.log('✅ Productos creados');

  // ─── Banners ──────────────────────────────────────────────────────────────
  await prisma.banner.createMany({
    data: [
      { titulo: '🔥 Samsung Tech Flash #9', subtitulo: 'Hasta 45% de descuento en televisores, smartphones y tablets Samsung. Solo por tiempo limitado.', imagen: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1400&q=85', colorFondo: '#1428A0', colorTexto: '#ffffff', ctaTexto: 'Ver ofertas Samsung', ctaLink: '/marketplace', orden: 1, activo: true },
      { titulo: '👗 Falabella Moda & Hogar', subtitulo: 'Liquidación de temporada con hasta 50% off en moda, hogar y electrodomésticos de las mejores marcas.', imagen: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85', colorFondo: '#7B2D8B', colorTexto: '#ffffff', ctaTexto: 'Explorar colección', ctaLink: '/marketplace', orden: 2, activo: true },
      { titulo: '✈️ Beneficios Latam para ti', subtitulo: 'Upgrades a Business Class y beneficios exclusivos en vuelos nacionales e internacionales.', imagen: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=85', colorFondo: '#E31837', colorTexto: '#ffffff', ctaTexto: 'Ver beneficios', ctaLink: '/marketplace', orden: 3, activo: true },
    ],
  });

  console.log('✅ Banners creados');

  // ─── Compras ──────────────────────────────────────────────────────────────
  const compras = [
    { id: 'cp1', colaboradorId: 'c1', productoId: 'p1', eventoId: 'ev1', fecha: new Date('2024-11-10T14:32:00'), monto: 779990, estado: 'completada' },
    { id: 'cp2', colaboradorId: 'c2', productoId: 'p10', eventoId: 'ev2', fecha: new Date('2024-11-08T11:20:00'), monto: 59990, estado: 'completada' },
    { id: 'cp3', colaboradorId: 'c3', productoId: 'p9', eventoId: 'ev2', fecha: new Date('2024-11-09T16:45:00'), monto: 49990, estado: 'completada' },
    { id: 'cp4', colaboradorId: 'c4', productoId: 'p2', eventoId: 'ev1', fecha: new Date('2024-11-11T09:15:00'), monto: 649990, estado: 'completada' },
    { id: 'cp5', colaboradorId: 'c5', productoId: 'p7', eventoId: 'ev2', fecha: new Date('2024-11-08T18:30:00'), monto: 74990, estado: 'completada' },
    { id: 'cp6', colaboradorId: 'c6', productoId: 'p3', eventoId: 'ev1', fecha: new Date('2024-11-10T12:00:00'), monto: 299990, estado: 'completada' },
    { id: 'cp7', colaboradorId: 'c7', productoId: 'p8', eventoId: 'ev2', fecha: new Date('2024-11-09T10:30:00'), monto: 299990, estado: 'completada' },
    { id: 'cp8', colaboradorId: 'c8', productoId: 'p9', eventoId: 'ev2', fecha: new Date('2024-11-10T14:00:00'), monto: 49990, estado: 'completada' },
    { id: 'cp9', colaboradorId: 'c9', productoId: 'p6', eventoId: 'ev2', fecha: new Date('2024-11-08T15:20:00'), monto: 349990, estado: 'completada' },
    { id: 'cp10', colaboradorId: 'c11', productoId: 'p4', eventoId: 'ev1', fecha: new Date('2024-11-11T11:45:00'), monto: 479990, estado: 'completada' },
    { id: 'cp11', colaboradorId: 'c12', productoId: 'p5', eventoId: 'ev1', fecha: new Date('2024-11-10T17:00:00'), monto: 369990, estado: 'completada' },
    { id: 'cp12', colaboradorId: 'c1', productoId: 'p10', eventoId: 'ev2', fecha: new Date('2024-11-09T13:15:00'), monto: 59990, estado: 'completada' },
  ];

  await prisma.compra.createMany({ data: compras });

  const puntosMap = {};
  for (const c of compras) {
    if (!puntosMap[c.colaboradorId]) puntosMap[c.colaboradorId] = 0;
    puntosMap[c.colaboradorId] += Math.floor(c.monto / 1000);
  }
  for (const [colaboradorId, puntos] of Object.entries(puntosMap)) {
    await prisma.colaborador.update({ where: { id: colaboradorId }, data: { puntos: { increment: puntos } } });
  }

  console.log('✅ Compras creadas');
  console.log('');
  console.log('🎉 Seed completado exitosamente');
  console.log('');
  console.log('📋 Usuarios de acceso:');
  console.log('  admin@nexlink.cl / password        → Super Admin');
  console.log('  rrhh@bancochile.cl / password      → Empresa (Banco de Chile)');
  console.log('  maria@bancochile.cl / password     → Colaborador (Banco de Chile)');
  console.log('  pedro@entel.cl / password          → Colaborador (Entel)');
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
