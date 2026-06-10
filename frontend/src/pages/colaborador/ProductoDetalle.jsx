import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, CheckCircle, Star, Package, Tag, Zap, Shield, Truck } from 'lucide-react';
import api from '../../services/api';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agregado, setAgregado] = useState(false);
  const [relacionados, setRelacionados] = useState([]);
  const [carrito, setCarrito] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexlink_carrito') || '[]'); } catch { return []; }
  });
  const [misCompras] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexlink_mis_compras') || '[]'); } catch { return []; }
  });

  const onAgregarCarrito = (producto) => {
    const nuevo = [...carrito, producto];
    setCarrito(nuevo);
    localStorage.setItem('nexlink_carrito', JSON.stringify(nuevo));
  };

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(r => {
        setProducto(r.data);
        const cat = r.data.categoria;
        const pid = r.data.id;
        api.get(`/productos?categoria=${encodeURIComponent(cat)}&limit=5`)
          .then(rr => setRelacionados((rr.data.productos || []).filter(p => p.id !== pid).slice(0, 4)))
          .catch(() => {});
      })
      .catch(() => navigate('/marketplace'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#999' }}>
      Cargando producto...
    </div>
  );

  if (!producto) return null;

  const estaEnCarrito = carrito.some(i => i.id === producto.id);
  const yaComprado = misCompras.includes(producto.id);
  const disabled = estaEnCarrito || yaComprado;
  const ahorro = producto.precioOriginal - producto.precioEvento;
  const porcAhorro = Math.round((ahorro / producto.precioOriginal) * 100);

  const handleAgregar = () => {
    if (disabled) return;
    onAgregarCarrito(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div style={{ background: '#ebebeb', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/marketplace')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#3483fa', fontWeight: 600, fontSize: 14 }}>
            <ChevronLeft size={16} /> Volver al Marketplace
          </button>
          <span style={{ color: '#ccc' }}>›</span>
          <span style={{ fontSize: 14, color: '#666' }}>{producto.categoria}</span>
          <span style={{ color: '#ccc' }}>›</span>
          <span style={{ fontSize: 14, color: '#333', fontWeight: 600 }}>{producto.nombre}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

          {/* Columna izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Imagen */}
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 420, position: 'relative' }}>
              {producto.descuento > 0 && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: '#EF4444', color: '#fff', fontSize: 14, fontWeight: 800, padding: '4px 12px', borderRadius: 4 }}>
                  -{producto.descuento}% OFF
                </div>
              )}
              {producto.imagen?.startsWith('http') ? (
                <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: '100%', maxHeight: 380, objectFit: 'contain', borderRadius: 8 }} />
              ) : (
                <div style={{ fontSize: 120 }}>📦</div>
              )}
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#333' }}>Descripción del producto</h2>
                <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>{producto.descripcion}</p>
              </div>
            )}

            {/* Características */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#333' }}>Características</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  ['Categoría', producto.categoria],
                  ['Condición', producto.condicion === 'nuevo' ? '✨ Nuevo' : '♻️ Usado'],
                  ['SKU', producto.sku || '—'],
                  ['Stock disponible', `${producto.stock} unidades`],
                  ['Empresa', producto.empresa?.nombre || '—'],
                  ['Descuento', `${producto.descuento}% OFF`],
                ].map(([label, val], i, arr) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <span style={{ fontSize: 14, color: '#888', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 14, color: '#333', fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {producto.tags?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#333' }}>Etiquetas</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {producto.tags.map(tag => (
                    <span key={tag} style={{ background: '#EFF6FF', color: '#3483fa', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{ background: '#fff', borderRadius: 12, padding: 28 }}>
              <div style={{ fontSize: 13, color: '#3483fa', fontWeight: 700, marginBottom: 8 }}>{producto.empresa?.nombre}</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3, marginBottom: 16 }}>{producto.nombre}</h1>
              <div style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>{producto.visitas?.toLocaleString('es-CL')} personas vieron este producto</div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#EF4444', textDecoration: 'line-through', marginBottom: 4 }}>Antes ${producto.precioOriginal?.toLocaleString('es-CL')}</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: '#1a1a2e', lineHeight: 1, marginBottom: 6 }}>${producto.precioEvento?.toLocaleString('es-CL')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: '#00a650', color: '#fff', fontSize: 13, fontWeight: 800, padding: '3px 10px', borderRadius: 4 }}>{porcAhorro}% OFF</span>
                  <span style={{ fontSize: 14, color: '#00a650', fontWeight: 700 }}>Ahorras ${ahorro?.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '10px 14px', background: producto.stock <= 5 ? '#FEF3C7' : '#F0FDF4', borderRadius: 8 }}>
                <Package size={16} color={producto.stock <= 5 ? '#D97706' : '#16A34A'} />
                <span style={{ fontSize: 13, fontWeight: 600, color: producto.stock <= 5 ? '#D97706' : '#16A34A' }}>
                  {producto.stock <= 0 ? 'Sin stock' : producto.stock <= 5 ? `¡Solo quedan ${producto.stock}!` : `${producto.stock} disponibles`}
                </span>
              </div>

              {agregado ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 8, background: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: 16 }}>
                  <CheckCircle size={20} /> ¡Agregado al carrito!
                </div>
              ) : (
                <button onClick={handleAgregar} disabled={disabled}
                  style={{ width: '100%', padding: '14px', borderRadius: 8, border: 'none', background: disabled ? '#e5e5e5' : '#3483fa', color: disabled ? '#999' : '#fff', fontWeight: 700, fontSize: 16, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <ShoppingCart size={20} />
                  {yaComprado ? 'Ya compraste este producto' : estaEnCarrito ? 'Ya está en el carrito' : 'Agregar al carrito'}
                </button>
              )}

              {(estaEnCarrito || agregado) && (
                <button onClick={() => navigate('/marketplace')}
                  style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 8, border: '1px solid #3483fa', background: '#fff', color: '#3483fa', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  Ver carrito →
                </button>
              )}
            </div>

            {/* Beneficios */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
              {[
                { icon: Truck, color: '#00a650', text: 'Envío a tu dirección registrada' },
                { icon: Shield, color: '#3483fa', text: 'Compra protegida con Webpay' },
                { icon: Tag, color: '#F59E0B', text: `${porcAhorro}% de descuento exclusivo` },
                { icon: Star, color: '#8B5CF6', fill: true, text: 'Ganas puntos NexLink con esta compra' },
              ].map(({ icon: Icon, color, fill, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <Icon size={18} color={color} fill={fill ? color : 'none'} />
                  <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Evento */}
            {producto.evento && (
              <div style={{ background: 'linear-gradient(135deg, #ecf2ff, #f0f7ff)', borderRadius: 12, padding: 20, border: '1px solid #dbeafe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Zap size={16} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF' }}>Evento Flash</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{producto.evento.nombre}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  Hasta {new Date(producto.evento.fechaFin).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Productos relacionados */}
        {relacionados.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#1a1a2e' }}>Productos relacionados</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {relacionados.map(p => {
                  const enCarrito = carrito.some(i => i.id === p.id);
                  const comprado = misCompras.includes(p.id);
                  const dis = enCarrito || comprado;
                  const aho = p.precioOriginal - p.precioEvento;
                  return (
                    <div key={p.id} onClick={() => navigate(`/marketplace/producto/${p.id}`)}
                      style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e5e5', overflow: 'hidden', cursor: 'pointer', transition: 'all .2s', position: 'relative' }}>
                      {dis && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.85)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                          <CheckCircle size={24} color="#10B981" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>{comprado ? 'Ya comprado' : 'En carrito'}</span>
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1, background: '#EF4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>-{p.descuento}%</div>
                      <div style={{ height: 160, overflow: 'hidden', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.imagen?.startsWith('http') ? <img src={p.imagen} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 48 }}>📦</span>}
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{p.categoria}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6, height: 36, overflow: 'hidden' }}>{p.nombre}</div>
                        <div style={{ fontSize: 11, color: '#EF4444', textDecoration: 'line-through' }}>${p.precioOriginal.toLocaleString('es-CL')}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>${p.precioEvento.toLocaleString('es-CL')}</div>
                        <div style={{ fontSize: 12, color: '#00a650', fontWeight: 600 }}>Ahorro ${aho.toLocaleString('es-CL')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
