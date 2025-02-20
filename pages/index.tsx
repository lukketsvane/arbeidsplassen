import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Arbeidsplassen Jobs Feed</title>
      <meta name="description" content="Live job vacancy feed from NAV's stilling-feed API" />
    </Head>
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Arbeidsplassen Jobs Feed</h1>
      <p>This site provides a live feed of job vacancies in Norway using NAV's stilling-feed API.</p>
      <p>Access the API at <code>/api/jobs</code></p>
    </main>
  </>
);
export default Home;
