import styles from './Receptes.module.css';
import { useNavigate } from "react-router-dom";

const receptesMock = [
  { id: 1, nom: 'Paella' },
  { id: 2, nom: 'Pollastre' },
  { id: 3, nom: 'Amanida' },
  { id: 4, nom: 'Sardines' },
];

const ReceptaCard = ({ recepta }) => {
  const navigate = useNavigate();
  return (
  <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden
                  hover:border-neutral-300 transition-colors">
    {recepta.imatge ? (
      <img src={recepta.imatge} alt={recepta.nom} className="w-full h-36 object-cover rounded-t-xl" />
    ) : (
      <div className="w-full h-36 flex items-center justify-center bg-neutral-50 text-4xl">
        🍽️
      </div>
    )}
    <div className="p-4 text-center">
      <h5 className="mt-2 mb-4 text-base font-semibold tracking-tight text-gray-900 leading-snug">
        {recepta.nom}
      </h5>

      <button
        onClick={() => navigate(`/receptes/${recepta.id}`)}
        className={styles.buttonLists}
      >
        Veure
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
        </svg>
      </button>
    </div>
  </div>
  )
};

const Receptes = () => {
  const receptes = receptesMock;
  
  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Receptes</h1>
        <button className={styles.button}>+ Nova recepta</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {receptesMock.map(r => (
          <ReceptaCard key={r.id} recepta={r} />
        ))}
      </div>
    </div>
  );
};

export default Receptes;