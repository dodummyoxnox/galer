import { getStatusLabel } from '../../data/mockData';
import './StatusStamp.css';

export default function StatusStamp({ status }) {
  const statusClass = {
    TERSEDIA: 'stamp--tersedia',
    TERJUAL: 'stamp--terjual',
    TIDAK_DIJUAL: 'stamp--tidak-dijual',
  };

  return (
    <span className={`stamp ${statusClass[status] || ''}`}>
      {getStatusLabel(status)}
    </span>
  );
}
