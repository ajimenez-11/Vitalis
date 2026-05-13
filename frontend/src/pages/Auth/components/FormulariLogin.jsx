import { useState } from 'react';
import styles from '../Login.module.css';

const missatgeError = (err) => {
  const status = err?.response?.status;
  const msg = err?.response?.data?.message ?? '';

  if (status === 403 || msg.toLowerCase().includes('desactivat') || msg.toLowerCase().includes('inactivo') || msg.toLowerCase().includes('inactive') || msg.toLowerCase().includes('disabled'))
    return "El teu compte ha estat desactivat. Contacta amb l'administrador.";

  if (status === 401 || msg.toLowerCase().includes('credencial') || msg.toLowerCase().includes('incorrect') || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('unauthorized'))
    return 'Email o contrasenya incorrectes. Torna-ho a intentar.';

  if (status === 429)
    return 'Massa intents fallits. Espera uns minuts i torna-ho a provar.';

  if (status >= 500)
    return 'Error del servidor. Torna-ho a intentar més tard.';

  if (msg) return msg;

  return "Error d'autenticació. Comprova les dades i torna-ho a intentar.";
};

const FormulariLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [carregant, setCarregant] = useState(false);
  const [error, setError] = useState('');
  const [tipusError, setTipusError] = useState('');

  const validar = () => {
    const errs = {};
    if (!email.trim()) errs.email = "L'email és obligatori";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "L'email no és vàlid";
    if (!password.trim()) errs.password = 'La contrasenya és obligatòria';
    else if (password.length < 6) errs.password = 'Mínim 6 caràcters';
    return errs;
  };

  const enviar = async () => {
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setCarregant(true);
    setError('');
    setTipusError('');
    try {
      await onLogin({ email, password });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message ?? '';
      if (status === 403 || msg.toLowerCase().includes('desactivat') || msg.toLowerCase().includes('inactivo') || msg.toLowerCase().includes('inactive') || msg.toLowerCase().includes('disabled'))
        setTipusError('inactive');
      else if (status === 401 || status === 422)
        setTipusError('credentials');
      else
        setTipusError('generic');
      setError(missatgeError(err));
    } finally {
      setCarregant(false);
    }
  };

  const onEnter = (e) => { if (e.key === 'Enter') enviar(); };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoBox}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>Benvingut</h2>
        <p className={styles.subtitle}>Inicia sessió per continuar</p>

        {error && (
          <div className={`${styles.errorBanner} ${styles[`errorBanner_${tipusError}`] ?? ''}`}>
            <span className={styles.errorBannerIcon}>
              {tipusError === 'inactive' ? '🔒' : tipusError === 'credentials' ? '⚠️' : '❌'}
            </span>
            <span>{error}</span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); setError(''); }}
            onKeyDown={onEnter}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="nom@empresa.cat"
            autoComplete="email"
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
        </div>

        <div className={styles.fieldLast}>
          <label className={styles.label}>Contrasenya</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); setError(''); }}
            onKeyDown={onEnter}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
        </div>

        <button type="button" onClick={enviar} disabled={carregant} className={styles.btnPrimary}>
          {carregant ? 'Entrant...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
};

export default FormulariLogin;