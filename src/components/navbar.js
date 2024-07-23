import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const router = useRouter();
  const [selectedTechnique, setSelectedTechnique] = useState('');

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleTechniqueChange = (event) => {
    setSelectedTechnique(event.target.value);
    // Handle technique change here if needed
  };

  return (
    <div className={styles.navbar}>
      <button onClick={handleHomeClick} className={styles.homeButton}>Home</button>
      <select value={selectedTechnique} onChange={handleTechniqueChange} className={styles.dropdown}>
        <option value="" disabled>Analysis Technique</option>
        <option value="technique1">Technique 1</option>
        <option value="technique2">Technique 2</option>
        <option value="technique3">Technique 3</option>
      </select>


  <select value={selectedTechnique} onChange={handleTechniqueChange} className={styles.dropdown}>
  <option value="" disabled>Data View</option>
  <option value="technique1">All Data</option>
  <option value="technique2">Simplifed 1</option>
  <option value="technique3">Simplifed 2</option>
  </select>
</div>
  );
};

export default NavBar;
