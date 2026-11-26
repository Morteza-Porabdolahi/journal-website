import Banner from './components/Banner';
import About from './components/About';
import Download from './components/Download';
import NewsParent from './components/NewsParent';
import Awards from './components/Awards';
import Members from './components/Members';
import SubmitArticle from './components/SubmitArticle'; // ← جدید

export default function Home() {
    return (
        <>
            <Banner />
            <About />
            <Download />
            <NewsParent />
            <Awards />
            <Members />
            <SubmitArticle />
        </>
    );
}
