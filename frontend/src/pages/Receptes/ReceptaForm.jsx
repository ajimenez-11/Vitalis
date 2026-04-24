import styles from './Receptes.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import Form from '../../components/Form/Form.jsx';
import { useState, useEffect } from 'react';
import { getRecepta, updateRecepta } from '../../api/receptes'; // Importa tus funciones de API

const ReceptaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar los datos reales de la receta al entrar
  useEffect(() => {
    const fetchRecepta = async () => {
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
        console.error("Error cargando la receta:", error);
        setInitialData(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecepta();
  }, [id]);

const handleFormSubmit = async (data) => {
  const porcions = parseInt(data.porciones_base ?? data.porcions_base);
  if (!porcions || porcions <= 0) {
    alert("El camp 'porcions base' és obligatori i ha de ser un número positiu.");
    return;
  }

  const imatgeFile = data.imatge?.[0] instanceof File ? data.imatge[0] : null;

  console.log("imatgeFile:", imatgeFile); // para verificar

  const payload = {
    nom:           data.nombre_receta ?? data.nom,
    descripcio:    data.descripcion   ?? data.descripcio,
    porcions_base: porcions,
    ...(imatgeFile ? { imatge: imatgeFile } : {}),  // solo si hay archivo real
  };

  try {
    await updateRecepta(id, payload);
    alert("Recepta actualitzada correctament!");
    navigate('/receptes');
  } catch (error) {
    console.error("Error al actualizar:", error.response?.data || error);
    alert("Error al guardar los cambios.");
  }
};

  const handleFormCancel = async (data) => {
    navigate('/receptes');
  };


  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContent}>
        <div className={styles.mainInner}>
          <p className={styles.breadcrumb}>
            Receptes &rsaquo; Editar
          </p>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <h1 className={styles.cardTitle}>Editar recepta</h1>
                <p className={styles.cardSubtitle}>
                  #{id} · {initialData?.nombre_receta || initialData?.nom || '—'}
                </p>
              </div>
            </div>

            <div className={styles.formArea}>
              {initialData === undefined ? (
                <p className={styles.errorMessage}>No s'ha trobat la recepta amb id {id}.</p>
              ) : loading ? (
                <p className={styles.loadingMessage}>Carregant...</p>
              ) : (
                <Form
                  type="recetas"
                  initialData={initialData}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel} // Pasamos la función de cancelar
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