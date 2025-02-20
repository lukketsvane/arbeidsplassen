import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

type Employer = {
  name?: string;
};

type Job = {
  uuid: string;
  published: string;
  title: string;
  description: string;
  link: string;
  employer?: Employer;
};

type HomeProps = {
  jobs: Job[];
};

const Home: NextPage<HomeProps> = ({ jobs }) => {
  return (
    <>
      <Head>
        <title>Arbeidsplassen Jobs Feed</title>
        <meta name="description" content="Live job vacancy feed from NAV's public-feed API" />
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Welcome to Arbeidsplassen Jobs Feed</h1>
        {jobs.length === 0 ? (
          <p>No jobs found. Verify your API token or try again later.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {jobs.map((job) => (
              <div
                key={job.uuid}
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  borderRadius: '8px',
                }}
              >
                <h2>{job.title}</h2>
                {job.employer && job.employer.name && (
                  <p><strong>Employer:</strong> {job.employer.name}</p>
                )}
                <p>
                  <strong>Published:</strong> {new Date(job.published).toLocaleDateString()}
                </p>
                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  // Construct the base URL dynamically using the request host.
  const host = context.req.headers.host;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch all jobs via our custom endpoint that pages through the results.
    const res = await fetch(`${baseUrl}/api/allJobs`);
    const data = await res.json();
    const jobs = data.content || [];
    console.log("Jobs fetched:", jobs.length);
    return { props: { jobs } };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { props: { jobs: [] } };
  }
};

export default Home;
