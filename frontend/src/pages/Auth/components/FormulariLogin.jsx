import { useState } from 'react';
import styles from '../Login.module.css';

const interpretarError = (err) => {
  const status  = err?.response?.status;
  const message = err?.response?.data?.message ?? '';

  // Usuari desactivat 
  if (
    status === 403 ||
    message.toLowerCase().includes('desactivat') ||
    message.toLowerCase().includes('inactivo') ||
    message.toLowerCase().includes('inactive') ||
    message.toLowerCase().includes('disabled')
  ) {
    return 'El teu compte ha estat desactivat. Contacta amb l\'administrador.';
  }

  // Credencials incorrectes 
  if (
    status === 401 ||
    message.toLowerCase().includes('credencial') ||
    message.toLowerCase().includes('incorrect') ||
    message.toLowerCase().includes('invalid') ||
    message.toLowerCase().includes('unauthorized')
  ) {
    return 'Email o contrasenya incorrectes. Torna-ho a intentar.';
  }

  // Massa intents 
  if (status === 429) {
    return 'Massa intents fallits. Espera uns minuts i torna-ho a provar.';
  }

  // Error de servidor
  if (status >= 500) {
    return 'Error del servidor. Torna-ho a intentar més tard.';
  }

  // Missatge directe de l'API si n'hi ha
  if (message) return message;

  // Fallback genèric
  return "Error d'autenticació. Comprova les dades i torna-ho a intentar.";
};

const FormulariLogin = ({ onLogin }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [errorApi, setErrorApi] = useState('');
  const [errorType, setErrorType] = useState(''); // 'inactive' | 'credentials' | 'generic'

  const validate = () => {
    const newErrors = {};
    if (!email.trim())
      newErrors.email = "L'email és obligatori";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "L'email no és vàlid";
    if (!password.trim())
      newErrors.password = 'La contrasenya és obligatòria';
    else if (password.length < 6)
      newErrors.password = 'Mínim 6 caràcters';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setErrorApi('');
    setErrorType('');
    try {
      await onLogin({ email, password });
    } catch (err) {
      const status  = err?.response?.status;
      const message = err?.response?.data?.message ?? '';

      if (
        status === 403 ||
        message.toLowerCase().includes('desactivat') ||
        message.toLowerCase().includes('inactivo') ||
        message.toLowerCase().includes('inactive') ||
        message.toLowerCase().includes('disabled')
      ) {
        setErrorType('inactive');
      } else if (status === 401 || status === 422) {
        setErrorType('credentials');
      } else {
        setErrorType('generic');
      }

      setErrorApi(interpretarError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoBox}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>Benvingut</h2>
        <p className={styles.subtitle}>Inicia sessió per continuar</p>

        {errorApi && (
          <div className={`${styles.errorBanner} ${styles[`errorBanner_${errorType}`] ?? ''}`}>
            <span className={styles.errorBannerIcon}>
              {errorType === 'inactive' ? '🔒' : errorType === 'credentials' ? '⚠️' : '❌'}
            </span>
            <span>{errorApi}</span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: undefined }));
              setErrorApi('');
            }}
            onKeyDown={handleKeyDown}
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
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: undefined }));
              setErrorApi('');
            }}
            onKeyDown={handleKeyDown}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={styles.btnPrimary}
        >
          {loading ? 'Entrant...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
};

export default FormulariLogin;