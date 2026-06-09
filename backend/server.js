require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const empresasRoutes = require('./routes/empresas');
const colaboradoresRoutes = require('./routes/colaboradores');
const eventosRoutes = require('./routes/eventos');
const productosRoutes = require('./routes/productos');
const dashboardRoutes = require('./routes/dashboard');
const comprasRoutes = require('./routes/compras');
const reportesRoutes = require('./routes/reportes');
const uploadsRoutes = require('./routes/uploads');
const bannersRoutes = require('./routes/banners');
const paginaEmpresaRoutes = require('./routes/paginaEmpresa');
const scraperRoutes = require('./routes/scraper');
const perfilRoutes = require('./routes/perfil');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/pagina-empresa', paginaEmpresaRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/perfil', perfilRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0', plataforma: 'NexLink', db: 'PostgreSQL' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 NexLink Backend v2.0 corriendo en http://localhost:${PORT}`);
});
