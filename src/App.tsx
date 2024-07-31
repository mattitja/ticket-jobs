import { useEffect, useState } from 'react';
import { TicketJobList } from './TicketJobList';

function App() {
  const [ticketJobs, setTicketJobs] = useState<TicketJob[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const getPipeline = async () => {
      try {
        //
        const res = await fetch(
          //'https://b72b14fe-4f57-4364-9f1a-282a60cc8164.mock.pstmn.io/ticketJobs'
          'http://localhost:63007/admin-mosaic/ticket-jobs/customers/VALID_USER'
        );
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();

        // Debugging
        console.log('Fetched Data:', data);

        if (Array.isArray(data.ticketJobs)) {
          setTicketJobs(data.ticketJobs);
          setErrorMessage(null); // Clear any previous error messages
        } else {
          console.error('Unexpected data format:', data);
          setTicketJobs([]);
          setErrorMessage('Keine TicketJobs gefunden');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setTicketJobs([]);
        setErrorMessage('Keine TicketJobs gefunden');
      }
    };

    getPipeline();
    const intervalId = setInterval(getPipeline, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <TicketJobList ticketJobs={ticketJobs} />
      )}
    </div>
  );
}

export default App;
