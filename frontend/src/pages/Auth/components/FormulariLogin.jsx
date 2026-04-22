import { useState } from 'react'
import styles from "../Login.module.css"

const FormulariLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorApi, setErrorApi] = useState('')

  const validate = () => {
    const newErrors = {}

    if (!email.trim()) newErrors.email = "L'email és obligatori"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "L'email no és vàlid"

    if (!password.trim()) newErrors.password = 'La contrasenya és obligatòria'
    else if (password.length < 6) newErrors.password = 'Mínim 6 caràcters'

    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrorApi('')

    try {
      await onLogin({ email, password })
    } catch (err) {
      setErrorApi(err?.message || "Error d'autenticació")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <h2 className={styles.title}>Benvingut</h2>
        <p className={styles.subtitle}>Inicia sessió per continuar</p>

        {errorApi && <p className={styles.errorMsg}>{errorApi}</p>}

        {/* EMAIL */}
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setErrors(p => ({ ...p, email: undefined }))
            }}
            className={styles.input}
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
        </div>

        {/* PASSWORD */}
        <div className={styles.fieldLast}>
          <label className={styles.label}>Contrasenya</label>

          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              setErrors(p => ({ ...p, password: undefined }))
            }}
            className={styles.input}
          />

          {errors.password && (
            <p className={styles.errorMsg}>{errors.password}</p>
          )}
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
  )
}

export default FormulariLogin