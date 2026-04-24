import styles from './Receptes.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import Form from '../../components/Form/Form.jsx';
import { useState, useEffect } from 'react';
import { getRecepta, updateRecepta, createRecepta } from '../../api/receptes';

const ReceptaForm = ({ id: idProp, onBack }) => {
  const { id: idParam } = useParams();
  const navigate = useNavigate();

  // Si idProp es 'crear', lo tratamos como nulo para el formulario
  const isCreating = idProp === 'crear' || (!idProp && !idParam);
  const id = isCreating ? null : (idProp ?? idParam);

  const [initialData, setInitialData] = useState(isCreating ? {} : null);
  const [loading, setLoading] = useState(!isCreating);

  useEffect(() => {
    const fetchRecepta = async () => {
      if (isCreating) return;
      try {
        setLoading(true);
        const response = await getRecepta(id);
        const data = response.data?.data || response.data || response;
        setInitialData({
          nombre_receta:  data.nom           ?? '',
          descripcion:    data.descripcio    ?? '',
          porciones_base: data.porcions_base ?? '',
          linies:         data.linies        ?? [],
        });
      } catch (error) {
        console.error('Error cargando la receta:', error);
        setInitialData(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchRecepta();
  }, [id, isCreating]);

  const handleFormSubmit = async (data) => {
    const porcions = parseInt(data.porciones_base ?? data.porcions_base);
    if (!porcions || porcions <= 0) {
      alert("El camp 'porcions base' és obligatori.");
      return;
    }

    const imatgeFile = data.imatge?.[0] instanceof File ? data.imatge[0] : null;
    const payload = {
      nom:           data.nombre_receta ?? data.nom,
      descripcio:    data.descripcion   ?? data.descripcio,
      porcions_base: porcions,
      ...(imatgeFile ? { imatge: imatgeFile } : {}),
    };

    try {
      if (isCreating) {
        await createRecepta(payload);
        alert('Recepta creada correctament!');
      } else {
        await updateRecepta(id, payload);
        alert('Recepta actualitzada correctament!');
      }
      
      if (onBack) onBack();
      else navigate('/receptes');
    } catch (error) {
      console.error('Error al guardar:', error.response?.data || error);
      alert('Error al guardar la recepta.');
    }
  };

  const handleFormCancel = () => {
    if (onBack) onBack();
    else navigate('/receptes');
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContent}>
        <div className={styles.mainInner}>
          <p className={styles.breadcrumb}>Receptes › {isCreating ? 'Nova' : 'Editar'}</p>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <h1 className={styles.cardTitle}>{isCreating ? 'Nova Recepta' : 'Editar recepta'}</h1>
                {!isCreating && (
                   <p className={styles.cardSubtitle}>
                    #{id} · {initialData?.nombre_receta || '—'}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.formArea}>
              {initialData === undefined ? (
                <p className={styles.errorMessage}>No s'ha trobat la recepta.</p>
              ) : loading ? (
                <p className={styles.loadingMessage}>Carregant...</p>
              ) : (
                <Form
                  type="recetas"
                  initialData={initialData}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceptaForm;