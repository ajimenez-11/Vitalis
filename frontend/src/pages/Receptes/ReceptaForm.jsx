import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecepta, updateRecepta, createRecepta } from '../../api/receptes';
import { Button, FormField, PageHeader } from '../../components/ui';
import inputStyles from '../../components/ui/shared/Input.module.css';
import styles from './Receptes.module.css';

const ReceptaForm = ({ id: idProp, onBack }) => {
  const { id: idParam } = useParams();
  const navigate = useNavigate();

  const isCreating = idProp === 'crear' || (!idProp && !idParam);
  const id = isCreating ? null : (idProp ?? idParam);

  const [form, setForm] = useState({ nom: '', descripcio: '', porcions_base: '' });
  const [imatge, setImatge] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(!isCreating);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isCreating) return;
    const load = async () => {
      try {
        setLoading(true);
        const res  = await getRecepta(id);
        const data = res.data?.data || res.data || res;
        setForm({
          nom: data.nom ?? '',
          descripcio: data.descripcio ?? '',
          porcions_base: data.porcions_base ?? '',
        });
        // Si té imatge existent, mostrem preview
        const url = data.imatge_url || (data.imatge ? `http://localhost:8000/${data.imatge}` : null);
        if (url) setPreview(url);
      } catch {
        setError("No s'ha pogut carregar la recepta.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isCreating]);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImatge = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImatge(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const porcions = parseInt(form.porcions_base);
    if (!form.nom.trim())     { setError('El nom és obligatori'); return; }
    if (!porcions || porcions <= 0) { setError('Les porcions base han de ser un nombre positiu'); return; }

    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, porcions_base: porcions, ...(imatge ? { imatge } : {}) };
      if (isCreating) await createRecepta(payload);
      else            await updateRecepta(id, payload);
      if (onBack) onBack();
      else navigate('/receptes');
    } catch (e) {
      setError(e.response?.data?.message ?? 'Error al guardar la recepta.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { if (onBack) onBack(); else navigate('/receptes'); };

  if (loading) return <p className={styles.status}>Carregant...</p>;

  return (
    <div>
      <PageHeader
        title={isCreating ? 'Nova recepta' : 'Editar recepta'}
        subtitle={!isCreating ? `#${id}` : undefined}
        action={<Button variant="ghost" onClick={handleCancel}>← Tornar</Button>}
      />

      {error && <div className={styles.pageError}>{error}</div>}

      <div className={styles.formCard}>
        <FormField label="Nom *">
          <input
            name="nom" value={form.nom} onChange={handle}
            className={inputStyles.input} placeholder="Ex: Arròs a la cassola"
          />
        </FormField>

        <FormField label="Descripció">
          <textarea
            name="descripcio" value={form.descripcio} onChange={handle}
            className={inputStyles.input} rows={3}
            placeholder="Descripció opcional..."
          />
        </FormField>

        <FormField label="Porcions base *">
          <input
            name="porcions_base" type="number" min="1"
            value={form.porcions_base} onChange={handle}
            className={inputStyles.input} placeholder="Ex: 10"
          />
        </FormField>

        <FormField label="Imatge (opcional)">
          <input type="file" accept="image/*" onChange={handleImatge} className={inputStyles.input} />
          {preview && (
            <img src={preview} alt="Preview" className={styles.imatgePreview} />
          )}
        </FormField>

        <div className={styles.formActions}>
          <Button variant="secondary" onClick={handleCancel} disabled={saving}>
            Cancel·lar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Desant…' : isCreating ? 'Crear recepta' : 'Desar canvis'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceptaForm;