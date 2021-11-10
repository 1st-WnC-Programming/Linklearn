import AppRouter from './Router';

const App = () => {
  return (
    <>
      <AppRouter />
      <footer>&copy; {new Date().getFullYear()} Linklearn</footer>
    </>
  );
};

export default App;
