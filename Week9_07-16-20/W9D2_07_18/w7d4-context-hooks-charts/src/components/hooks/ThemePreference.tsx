import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function ThemePreference() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light'
    );
  };

  return (
    <section>
      <p>Current theme: {theme}</p>

      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </section>
  );
}