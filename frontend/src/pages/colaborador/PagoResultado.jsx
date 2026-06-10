import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../../services/api';

export default function PagoResultado() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('cargando'); // cargando | ok | error | rechazado
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token_ws = searchParams.get('token_ws');
    const TBK_TOKEN = searchParams.get('TBK_TOKEN');

    // Si viene TBK_TOKEN sin token_ws = pago cancelado por el usuario
    if (TBK_TOKEN && !token_ws) {
      setEstado('rechazado');
      setError('Pago cancelado por el usuario.');
      return;
    }

    if (!token_ws) {
      setEstado('error');
      setError('No se recibió token de pago.');
      return;
    }

    // Recuperar metadata del sessionStorage
    let items = [];
    let direccionId = null;
    try {
      const saved = sessionStorage.getItem('nexlink_pago');
      if (saved) {
        const parsed = JSON.parse(saved);
        items = parsed.items || [];
        direccionId = parsed.direccionId || null;
        sessionStorage.removeItem('nexlink_pago');
      localStorage.removeItem('nexlink_carrito');
      }
    } catch {}

    api.post('/pagos/confirmar', { token_ws, items, direccionId })
      .then(r => {
        setDetalle(r.data);
        setEstado('ok');
      })
      .catch(e => {
        setError(e.response?.data?.error || 'Error al confirmar el pago.');
        setEstado('error');
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 48, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,.1)' }}>

        {estado === 'cargando' && (
          <>
            <Loader size={48} style={{ color: '#3483fa', marginBottom: 16, animation: 'spin 1s linear infinite' }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Confirmando pago...</h2>
            <p style={{ color: '#666' }}>Estamos procesando tu transacción con Transbank.</p>
          </>
        )}

        {estado === 'ok' && (
          <>
            <CheckCircle size={56} style={{ color: '#10B981', marginBottom: 16 }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#065F46' }}>¡Pago exitoso!</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>Tu compra fue procesada correctamente.</p>
            {detalle?.transbank && (
              <div style={{ background: '#F0FDF4', borderRadius: 10, padding: 20, marginBottom: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    ['Orden de compra', detalle.transbank.buy_order],
                    ['Monto', `$${detalle.transbank.amount?.toLocaleString('es-CL')}`],
                    ['Autorización', detalle.transbank.authorization_code],
                    ['Tarjeta', detalle.transbank.card_detail?.card_number ? `**** ${detalle.transbank.card_detail.card_number}` : '—'],
                    ['Fecha', detalle.transbank.transaction_date ? new Date(detalle.transbank.transaction_date).toLocaleString('es-CL') : '—'],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#666' }}>{label}</span>
                      <span style={{ fontWeight: 700 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate('/marketplace/mis-compras')}
                style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: '#3483fa', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Ver mis compras
              </button>
              <button onClick={() => navigate('/marketplace')}
                style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Volver al inicio
              </button>
            </div>
          </>
        )}

        {(estado === 'error' || estado === 'rechazado') && (
          <>
            <XCircle size={56} style={{ color: '#EF4444', marginBottom: 16 }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#991B1B' }}>
              {estado === 'rechazado' ? 'Pago cancelado' : 'Pago fallido'}
            </h2>
            <p style={{ color: '#666', marginBottom: 24 }}>{error || 'Hubo un problema con tu pago.'}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate('/marketplace')}
                style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: '#3483fa', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Volver al marketplace
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
