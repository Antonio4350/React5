import { useEffect } from 'react';

const Background = () => {
  useEffect(() => {
    const body = document.querySelector('body');

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      const r = Math.round((x / 100) * 255);
      const g = Math.round((y / 100) * 255);
      const b = 200;

      body.style.background = `radial-gradient(circle at ${x}% ${y}%, rgb(${r}, ${g}, ${b}), black)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // Este componente no renderiza nada en la pantalla
};

export default Background;