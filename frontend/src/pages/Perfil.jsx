import { useState, useEffect } from 'react';
import { User, Lock, CheckCircle, AlertCircle, Star, MapPin, Plus, Pencil, Trash2, Home } from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ROL_LABELS = { admin: 'Administrador NexLink', empresa: 'Portal Empresa', colaborador: 'Colaborador' };
const ROL_COLORS = { admin: 'linear-gradient(135deg,#1E2761,#4F46E5)', empresa: 'linear-gradient(135deg,#028090,#02C39A)', colaborador: 'linear-gradient(135deg,#4F46E5,#7C3AED)' };

const REGIONES_CL = [
  'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo',
  'Valparaíso','Metropolitana de Santiago','O\'Higgins','Maule','Ñuble',
  'Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes',
];

const FORM_EMPTY = { alias: '', calle: '', numero: '', depto: '', comuna: '', ciudad: '', region: '', codigoPostal: '', predeterminada: false };

export default function Perfil() {
  const { user } = useAuth();
  const [tab, setTab] = useState('info');
  const [pwForm, setPwForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [colaboradorData, setColaboradorData] = useState(null);

  // Direcciones
  const [direcciones, setDirecciones] = useState([]);
  const [loadingDir, setLoadingDir] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formDir, setFormDir] = useState(FORM_EMPTY);
  const [savingDir, setSavingDir] = useState(false);
  const [msgDir, setMsgDir] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const setPw = (k, v) => setPwForm(f => ({ ...f, [k]: v }));
  const setFD = (k, v) => setFormDir(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (user?.rol === 'colaborador' && user?.colaboradorId) {
      api.get(`/colaboradores/${user.colaboradorId}`).then(r => setColaboradorData(r.data)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (tab === 'direcciones' && user?.rol === 'colaborador') fetchDirecciones();
  }, [tab]);

  const fetchDirecciones = async () => {
    setLoadingDir(true);
    try { const r = await api.get('/perfil/direcciones'); setDirecciones(r.data); }
    catch {}
    finally { setLoadingDir(false); }
  };

  const abrirNueva = () => { setEditando(null); setFormDir(FORM_EMPTY); setMsgDir(null); setShowForm(true); };
  const abrirEditar = (d) => { setEditando(d.id); setFormDir({ alias: d.alias, calle: d.calle, numero: d.numero, depto: d.depto || '', comuna: d.comuna, ciudad: d.ciudad, region: d.region, codigoPostal: d.codigoPostal || '', predeterminada: d.predeterminada }); setMsgDir(null); setShowForm(true); };
  const cerrarForm = () => { setShowForm(false); setEditando(null); setFormDir(FORM_EMPTY); setMsgDir(null); };

  const guardarDireccion = async () => {
    const { alias, calle, numero, comuna, ciudad, region } = formDir;
    if (!alias || !calle || !numero || !comuna || !ciudad || !region)
      return setMsgDir({ tipo: 'error', texto: 'Completa los campos obligatorios' });
    setSavingDir(true); setMsgDir(null);
    try {
      if (editando) await api.put(`/perfil/direcciones/${editando}`, formDir);
      else await api.post('/perfil/direcciones', formDir);
      await fetchDirecciones();
      cerrarForm();
    } catch (e) {
      setMsgDir({ tipo: 'error', texto: e.response?.data?.error || 'Error al guardar' });
    } finally { setSavingDir(false); }
  };

  const eliminarDireccion = async (id) => {
    setDeletingId(id);
    try { await api.delete(`/perfil/direcciones/${id}`); await fetchDirecciones(); }
    catch {}
    finally { setDeletingId(null); }
  };

  const cambiarPassword = async () => {
    if (!pwForm.actual || !pwForm.nueva || !pwForm.confirmar) return setMsg({ tipo: 'error', texto: 'Completa todos los campos' });
    if (pwForm.nueva !== pwForm.confirmar) return setMsg({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' });
    if (pwForm.nueva.length < 6) return setMsg({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres' });
    setLoading(true); setMsg(null);
    try {
      await api.post('/auth/cambiar-password', { passwordActual: pwForm.actual, passwordNueva: pwForm.nueva });
      setMsg({ tipo: 'ok', texto: '¡Contraseña actualizada exitosamente!' });
      setPwForm({ actual: '', nueva: '', confirmar: '' });
    } catch (e) { setMsg({ tipo: 'error', texto: e.response?.data?.error || 'Error al cambiar contraseña' }); }
    finally { setLoading(false); }
  };

  const infoItems = [
    { label: 'Nombre completo', value: user?.nombre },
    { label: 'Email', value: user?.email },
    { label: 'Rol', value: ROL_LABELS[user?.rol] },
    ...(colaboradorData ? [
      { label: 'Empresa', value: colaboradorData.empresa?.nombre },
      { label: 'Cargo', value: colaboradorData.cargo || '—' },
      { label: 'Área', value: colaboradorData.area || '—' },
      { label: 'RUT', value: colaboradorData.rut || '—' },
      { label: 'Teléfono', value: colaboradorData.telefono || '—' },
    ] : []),
    { label: 'ID de cuenta', value: user?.id },
  ];

  const tabs = [
    { id: 'info', icon: User, label: 'Información' },
    { id: 'password', icon: Lock, label: 'Contraseña' },
    ...(user?.rol === 'colaborador' ? [{ id: 'direcciones', icon: MapPin, label: 'Direcciones' }] : []),
  ];

  return (
    <>
      <Topbar title="Mi Perfil" subtitle="Gestiona tu información personal" />
      <div className="page-body" style={{ maxWidth: 680 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 28, background: ROL_COLORS[user?.rol], borderRadius: 16, color: '#fff', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, flexShrink: 0 }}>{user?.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{user?.nombre}</div>
            <div style={{ fontSize: 14, opacity: .85, marginTop: 2 }}>{user?.email}</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ background: 'rgba(255,255,255,.2)', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{ROL_LABELS[user?.rol]}</span>
            </div>
          </div>
          {colaboradorData && (
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '12px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                <Star size={18} fill="#FCD34D" color="#FCD34D" />
                <span style={{ fontSize: 24, fontWeight: 800 }}>{colaboradorData.puntos}</span>
              </div>
              <div style={{ fontSize: 12, opacity: .8, marginTop: 2 }}>Puntos</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg)', borderRadius: 10, padding: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setMsg(null); }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .15s', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,.08)' : 'none' }}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Info */}
        {tab === 'info' && (
          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Información de la cuenta</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {infoItems.map((item, i) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < infoItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
            {colaboradorData?.compras?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>Últimas compras</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {colaboradorData.compras.slice(0, 5).map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg)', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.producto?.nombre || c.productoId}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.fecha).toLocaleDateString('es-CL')}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>${c.monto.toLocaleString('es-CL')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Password */}
        {tab === 'password' && (
          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Cambiar contraseña</div>
            {msg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 600, background: msg.tipo === 'ok' ? '#D1FAE5' : '#FEE2E2', color: msg.tipo === 'ok' ? '#065F46' : '#991B1B' }}>
                {msg.tipo === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {msg.texto}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['actual', 'Contraseña actual', '••••••••'], ['nueva', 'Nueva contraseña', 'Mínimo 6 caracteres'], ['confirmar', 'Confirmar nueva contraseña', 'Repite la contraseña']].map(([k, label, ph]) => (
                <div key={k}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input className="input" type="password" value={pwForm[k]} onChange={e => setPw(k, e.target.value)} placeholder={ph} style={{ width: '100%' }} />
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 24, width: '100%', height: 44 }} onClick={cambiarPassword} disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </div>
        )}

        {/* Tab: Direcciones */}
        {tab === 'direcciones' && (
          <div>
            {!showForm && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={abrirNueva}>
                  <Plus size={16} /> Nueva dirección
                </button>
              </div>
            )}

            {/* Formulario */}
            {showForm && (
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="section-title" style={{ marginBottom: 20 }}>{editando ? 'Editar dirección' : 'Nueva dirección'}</div>
                {msgDir && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600, background: '#FEE2E2', color: '#991B1B' }}>
                    <AlertCircle size={16} /> {msgDir.texto}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Alias <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input className="input" value={formDir.alias} onChange={e => setFD('alias', e.target.value)} placeholder="Ej: Casa, Oficina" style={{ width: '100%' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Calle <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input className="input" value={formDir.calle} onChange={e => setFD('calle', e.target.value)} placeholder="Ej: Av. Providencia" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Número <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input className="input" value={formDir.numero} onChange={e => setFD('numero', e.target.value)} placeholder="Ej: 1234" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Depto / Oficina</label>
                    <input className="input" value={formDir.depto} onChange={e => setFD('depto', e.target.value)} placeholder="Ej: Depto 502" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Comuna <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input className="input" value={formDir.comuna} onChange={e => setFD('comuna', e.target.value)} placeholder="Ej: Providencia" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Ciudad <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input className="input" value={formDir.ciudad} onChange={e => setFD('ciudad', e.target.value)} placeholder="Ej: Santiago" style={{ width: '100%' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Región <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <select className="input" value={formDir.region} onChange={e => setFD('region', e.target.value)} style={{ width: '100%' }}>
                      <option value="">Selecciona una región</option>
                      {REGIONES_CL.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Código postal</label>
                    <input className="input" value={formDir.codigoPostal} onChange={e => setFD('codigoPostal', e.target.value)} placeholder="Opcional" style={{ width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
                    <input type="checkbox" id="pred" checked={formDir.predeterminada} onChange={e => setFD('predeterminada', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    <label htmlFor="pred" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Dirección predeterminada</label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button className="btn btn-primary" style={{ flex: 1, height: 44 }} onClick={guardarDireccion} disabled={savingDir}>
                    {savingDir ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar dirección'}
                  </button>
                  <button className="btn" style={{ height: 44, padding: '0 20px' }} onClick={cerrarForm}>Cancelar</button>
                </div>
              </div>
            )}

            {/* Lista */}
            {loadingDir ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Cargando direcciones...</div>
            ) : direcciones.length === 0 && !showForm ? (
              <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                <MapPin size={40} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Sin direcciones guardadas</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Agrega una dirección para agilizar tus compras</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {direcciones.map(d => (
                  <div key={d.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, border: d.predeterminada ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: d.predeterminada ? 'var(--primary)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Home size={18} color={d.predeterminada ? '#fff' : 'var(--text-muted)'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{d.alias}</span>
                        {d.predeterminada && <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: 99 }}>Predeterminada</span>}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {d.calle} {d.numero}{d.depto ? `, ${d.depto}` : ''}<br />
                        {d.comuna}, {d.ciudad}<br />
                        {d.region}{d.codigoPostal ? ` — CP ${d.codigoPostal}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => abrirEditar(d)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => eliminarDireccion(d.id)} disabled={deletingId === d.id} style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={14} color="#DC2626" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
