import { useNavigate } from 'react-router-dom';
import DatePasscodeLock from '../../components/DatePasscodeLock.jsx';

export default function BirthdayUnlock() {
  const navigate = useNavigate();
  const handleSuccess = () => {
    sessionStorage.setItem('birthday-unlocked', 'true');
    navigate('/birthday/experience');
  };
  return <DatePasscodeLock title="Only You Can Open This" subtitle="Birth date. Birth month. Birth year. That's the little key to your next surprise." onSuccess={handleSuccess} />;
}
