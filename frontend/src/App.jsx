import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

import Login from './pages/Login';
import Registro from './pages/Registro';
import VerificarEmail from './pages/VerificarEmail';
import Perfil from './pages/Perfil';
import CambiarPassword from './pages/CambiarPassword';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/Dashboard';
import AdminEmpresas from './pages/admin/Empresas';
import AdminEventos from './pages/admin/Eventos';
import AdminColaboradores from './pages/admin/Colaboradores';
import AdminReportes from './pages/admin/Reportes';
import AdminBanners from './pages/admin/Banners';

import EmpresaDashboard from './pages/empresa/Dashboard';
import EmpresaProductos from './pages/empresa/Productos';
import EmpresaEventos from './pages/empresa/Eventos';
import EventoDetalle from './pages/empresa/EventoDetalle';
import EmpresaColaboradores from './pages/empresa/Colaboradores';
import EmpresaReportes from './pages/empresa/Reportes';
import MiPagina from './pages/empresa/MiPagina';

import Marketplace from './pages/colaborador/Marketplace';
import MisCompras from './pages/colaborador/MisCompras';
import MarcaPage from './pages/colaborador/MarcaPage';
import ProductoDetalle from './pages/colaborador/ProductoDetalle';
import PagoResultado from './pages/colaborador/PagoResultado';

const ROL_HOME = {
  admin: '/admin',
  empresa: '/empresa',
  colaborador: '/marketplace',
};

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.debeCambiarPassword) return <Navigate to="/cambiar-password" replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to={ROL_HOME[user.rol] || '/login'} replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROL_HOME[user.rol] || '/login'} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/cambiar-password" element={<CambiarPassword />} />
            <Route path="/verificar-email" element={<VerificarEmail />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/empresas" element={<ProtectedRoute roles={['admin']}><AppLayout><AdminEmpresas /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/eventos" element={<ProtectedRoute roles={['admin']}><AppLayout><AdminEventos /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/colaboradores" element={<ProtectedRoute roles={['admin']}><AppLayout><AdminColaboradores /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute roles={['admin']}><AppLayout><AdminReportes /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/banners" element={<ProtectedRoute roles={['admin']}><AppLayout><AdminBanners /></AppLayout></ProtectedRoute>} />

            {/* Empresa */}
            <Route path="/empresa" element={<ProtectedRoute roles={['empresa']}><AppLayout><EmpresaDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/empresa/productos" element={<ProtectedRoute roles={['empresa']}><AppLayout><EmpresaProductos /></AppLayout></ProtectedRoute>} />
            <Route path="/empresa/eventos" element={<ProtectedRoute roles={['empresa']}><AppLayout><EmpresaEventos /></AppLayout></ProtectedRoute>} />
            <Route path="/empresa/eventos/:id" element={<ProtectedRoute roles={['empresa','admin']}><AppLayout><EventoDetalle /></AppLayout></ProtectedRoute>} />
            <Route path="/empresa/colaboradores" element={<ProtectedRoute roles={['empresa']}><AppLayout><EmpresaColaboradores /></AppLayout></ProtectedRoute>} />
            <Route path="/empresa/reportes" element={<ProtectedRoute roles={['empresa']}><AppLayout><EmpresaReportes /></AppLayout></ProtectedRoute>} />
            <Route path="/empresa/mi-pagina" element={<ProtectedRoute roles={['empresa']}><AppLayout><MiPagina /></AppLayout></ProtectedRoute>} />

            {/* Colaborador */}
            <Route path="/marketplace" element={<ProtectedRoute roles={['colaborador']}><AppLayout><Marketplace /></AppLayout></ProtectedRoute>} />
            <Route path="/marketplace/mis-compras" element={<ProtectedRoute roles={['colaborador']}><AppLayout><MisCompras /></AppLayout></ProtectedRoute>} />
            <Route path="/marketplace/empresa/:empresaId" element={<ProtectedRoute roles={['colaborador']}><AppLayout><MarcaPage /></AppLayout></ProtectedRoute>} />
            <Route path="/marketplace/producto/:id" element={<ProtectedRoute roles={['colaborador']}><AppLayout><ProductoDetalle /></AppLayout></ProtectedRoute>} />
            <Route path="/pago/resultado" element={<ProtectedRoute roles={['colaborador']}><AppLayout><PagoResultado /></AppLayout></ProtectedRoute>} />

            {/* Perfil — todos los roles */}
            <Route path="/perfil" element={<ProtectedRoute roles={['admin','empresa','colaborador']}><AppLayout><Perfil /></AppLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
