import styles from './Receptes.module.css';
import { useParams } from 'react-router-dom';
import Form from '../../components/Form/Form.jsx';
import { useState, useEffect } from 'react';

const receptesMock = [
  { id: 1, nombre_receta: 'Paella', instrucciones: 'Pasos...' },
  { id: 2, nombre_receta: 'Pollastre', instrucciones: 'Pasos...' },
  { id: 3, nombre_receta: 'Amanida', instrucciones: 'Pasos...' },
];

const ReceptaForm = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const recepta = receptesMock.find(r => r.id === Number(id));
    setInitialData(recepta);
  }, [id]);

  const handleFormSubmit = (data) => {
    console.log("Datos enviados:", data);
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
                  #{id} · {initialData?.nombre_receta ?? '—'}
                </p>
              </div>
            </div>

            {/* Form area */}
            <div className={styles.formArea}>
              {initialData === undefined ? (
                <p className={styles.errorMessage}>
                  No s'ha trobat la recepta amb id {id}.
                </p>
              ) : initialData === null ? (
                <p className={styles.loadingMessage}>Carregant...</p>
              ) : (
                <Form
                  type="recetas"
                  initialData={initialData}
                  onSubmit={handleFormSubmit}
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
