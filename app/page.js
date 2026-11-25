import Banner from './components/Banner';
import About from './components/About';
import Download from './components/Download';
import News from './components/News';
import Awards from './components/Awards';
import Members from './components/Members';
import SubmitArticle from './components/SubmitArticle';   // ← جدید

export default function Home() {
  return (
    <>
      <Banner />
      <About />
      <Download />
      <News />
      <Awards />
      <Members />
      <SubmitArticle /> 
    </>
  );
}