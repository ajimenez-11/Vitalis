import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdSearch } from 'react-icons/md';
import styles from './Receptes.module.css';
import { getReceptes } from '../../api/receptes';
import { useAuth } from '../../context/AuthContext'; // adjust if needed
import ReceptaDetall from './ReceptaDetall';

const getImatgeUrl = (recepta) => {
  if (recepta.imatge_url) return recepta.imatge_url;
  if (recepta.imatge) return `http://localhost:8000/${recepta.imatge}`;
  return null;
};

const ReceptaCard = ({ recepta, onVeure }) => {
  const nombreMostrar = recepta.nom || recepta.nombre_receta || 'Sense nom';
  const imatgeUrl = getImatgeUrl(recepta);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden hover:border-neutral-300 transition-colors">
      {imatgeUrl ? (
        <img src={imatgeUrl} alt={nombreMostrar} className="w-full h-36 object-cover rounded-t-xl" />
      ) : (
        <div className="w-full h-36 flex items-center justify-center bg-neutral-50 text-4xl">
          🍽️
        </div>
      )}
      <div className="p-4 text-center">
        <h5 className="mt-2 mb-4 text-base font-semibold tracking-tight text-gray-900 leading-snug">
          {nombreMostrar}
        </h5>
        {/* Two actions: edit metadata (existing route) + manage ingredients (new detall) */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onVeure(recepta)}
            className={styles.buttonLists}
          >
            Ingredients <MdEdit className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Receptes = () => {
  const [receptes, setReceptes] = useState([]);
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [detall, setDetall]     = useState(null); // recepta object or null
  const { canWrite } = useAuth(); // adjust to your auth hook

  useEffect(() => {
    const fetchReceptes = async () => {
      try {
        setLoading(true);
        const response = await getReceptes();
        let arrayFinal = [];
        if (response.data && Array.isArray(response.data.data)) {
          arrayFinal = response.data.data;
        } else if (Array.isArray(response.data)) {
          arrayFinal = response.data;
        } else if (response.success && Array.isArray(response.data)) {
          arrayFinal = response.data;
        }
        setReceptes(arrayFinal);
      } catch (error) {
        console.error('Error cargando recetas:', error);
        setReceptes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReceptes();
  }, []);

  const filteredRecipes = Array.isArray(receptes)
    ? receptes.filter((r) => {
        const nombre = (r.nom || r.nombre_receta || '').toLowerCase();
        return nombre.includes(query.toLowerCase());
      })
    : [];

  // ── Show detall view when a recepta is selected ──
  if (detall) {
    return (
      <ReceptaDetall
        recepta={detall}
        onBack={() => setDetall(null)}
        canWrite={canWrite}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className={styles.subnav}>
        <h1 className="text-2xl font-bold text-gray-900">Receptes</h1>
        <div className="relative w-20 flex-1 max-w-md">
          <span className="absolute left-105 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MdSearch size={20} />
          </span>
          <input
            type="text"
            placeholder="Cerca per nom..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button className={styles.button}>+ Nova recepta</button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-lg italic">
          Carregant receptes des del servidor...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((r) => (
              <ReceptaCard key={r.id} recepta={r} onVeure={setDetall} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              {query
                ? `No s'ha trobat cap recepta que coincideixi amb "${query}"`
                : 'No hi ha receptes disponibles al sistema.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Receptes;