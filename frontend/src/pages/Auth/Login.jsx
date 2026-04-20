import { useNavigate } from 'react-router-dom'
import FormulariLogin from './components/FormulariLogin.jsx'

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = async ({ email, contrasenya }) => {
    console.log("Intentando login con:", email, contrasenya)
    
    if (email && contrasenya) {
      localStorage.setItem('token', 'token-falso-de-prueba')
      navigate('/home') 
    } else {
      alert("Por favor, rellena los campos")
    }
  }

  return (
    <div className="container mt-5">
      <FormulariLogin onLogin={handleLogin} />
    </div>
  )
}

export default Login