import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import styles from './Form.module.css';

const Form = ({ type, initialData = null, onSubmit }) => {
  const configs = {
    productos: {
      title: initialData ? 'Editar Producto' : 'Nuevo Producto',
      submitLabel: initialData ? 'Actualizar producto' : 'Crear producto',
      fields: [
        { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ex: Tomàquet ecològic' },
        { name: 'precio', label: 'Preu (€)', type: 'number', placeholder: '0.00' },
        { name: 'stock', label: 'Stock', type: 'number', placeholder: '0' },
      ],
    },
    recetas: {
      title: initialData ? 'Editar Receta' : 'Nueva Receta',
      submitLabel: initialData ? 'Actualizar receta' : 'Crear receta',
      fields: [
        { name: 'nombre_receta', label: 'Nom de la recepta', type: 'text', placeholder: 'Ex: Paella valenciana' },
        { name: 'descripcion', label: 'Descripció', type: 'textarea', placeholder: 'Escriu una descripció breu de la recepta...' },
        { name: 'porciones_base', label: 'Porcions base', type: 'number', placeholder: '4' },
        { name: 'imatge', label: 'Imatge', type: 'file' },
      ],
    },
    albaran: {
      title: initialData ? 'Editar Albarán' : 'Nuevo Albarán',
      submitLabel: initialData ? 'Actualizar albarán' : 'Crear albarán',
      fields: [
        { name: 'codigo_seguimiento', label: 'Codi de seguiment', type: 'text', placeholder: 'Ex: ALB-2024-001' },
        { name: 'fecha_emision', label: "Data d'emissió", type: 'date' },
      ],
    },
  };

  const currentConfig = configs[type];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {currentConfig.fields.map((field) => (
        <div key={field.name} className={styles.fieldGroup}>
          <label className={styles.label}>{field.label}</label>

          {field.type === 'textarea' ? (
            <textarea
              {...register(field.name)}
              placeholder={field.placeholder}
              className={styles.textarea}
            />
          ) : field.type === 'file' ? (
            <label className={styles.fileWrapper}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className={styles.fileLabel}>Selecciona un arxiu...</span>
              <input type="file" {...register(field.name)} className={styles.fileInput} />
            </label>
          ) : (
            <input
              type={field.type}
              {...register(field.name)}
              placeholder={field.placeholder}
              className={styles.input}
            />
          )}
        </div>
      ))}

      <div className={styles.divider} />

      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary}>
          Cancel·lar
        </button>
        <button type="submit" className={styles.btnPrimary}>
          {currentConfig.submitLabel}
        </button>
      </div>
    </form>
  );
};

export default Form;