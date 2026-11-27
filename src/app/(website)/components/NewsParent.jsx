import News from './News';
import { getNews, getNextEvent } from '@/src/db/queries';

export default async function NewsParent() {
    const news = await getNews();
    const next_event = await getNextEvent();

    return (
        <>
            <News news={news} next_event={next_event} />
        </>
    );
}
