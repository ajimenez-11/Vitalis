import { useState } from 'react'
import styles from "../Login.module.css"

const FormulariLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [contrasenya, setContrasenya] = useState('')
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = "L'email és obligatori"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "L'email no és vàlid"
    if (!contrasenya.trim()) newErrors.contrasenya = 'La contrasenya és obligatòria'
    else if (contrasenya.length < 6) newErrors.contrasenya = 'Mínim 6 caràcters'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setLoading(true)
    await onLogin({ email, contrasenya })
    setLoading(false)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <div className={styles.logoWrapper}>
          <div className={styles.logoBox}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>Benvingut</h2>
        <p className={styles.subtitle}>Inicia sessió per continuar</p>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            placeholder="hola@exemple.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
        </div>

        <div className={styles.fieldLast}>
          <label className={styles.label}>Contrasenya</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={contrasenya}
              onChange={e => { setContrasenya(e.target.value); setErrors(p => ({ ...p, contrasenya: undefined })) }}
              className={`${styles.input} ${styles.inputWithIcon} ${errors.contrasenya ? styles.inputError : ''}`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className={styles.eyeBtn}>
              {showPass ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.contrasenya && <p className={styles.errorMsg}>{errors.contrasenya}</p>}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={styles.btnPrimary}
        >
          {loading ? 'Entrant...' : 'Entrar'}
        </button>

        <button type="button" className={styles.btnSecondary}>
          Has oblidat la contrasenya?
        </button>

      </div>
    </div>
  )
}

export default FormulariLogin