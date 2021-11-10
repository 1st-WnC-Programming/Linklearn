import AppRouter from './Router';
import GlobalStyles from './GlobalStyles';
import Footer from './Footer';

const App = () => {
  return (
    <>
      <GlobalStyles />
      <AppRouter />
      <Footer />
      <footer>&copy; {new Date().getFullYear()} Linklearn</footer>
    </>
  );
};

export default App;
