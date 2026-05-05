import { useNavigate } from 'react-router-dom';
import FormulariLogin from './components/FormulariLogin.jsx';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    await login(email, password);
    navigate('/');
  };

  return <FormulariLogin onLogin={handleLogin} />;
};

export default Login;