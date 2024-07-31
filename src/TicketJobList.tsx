import { FC } from 'react';
import styles from './TicketJobList.module.css'; // Importiere Styles

type Step = {
  id: string;
  state: string;
  type: string;
  startedAt?: string;
  finishedAt?: string;
  failedAt?: string;
  failureReason?: string;
};

type TicketJob = {
  id: string;
  state: string;
  createdAt: string;
  startedAt?: string;
  failedAt?: string;
  steps: Step[];
  type: string;
  customerNumber: string;
};

const stateToEmoji = (state: string) => {
  switch (state) {
    case 'ERROR':
      return '❌';
    case 'FINISHED':
      return '✅';
    case 'PENDING':
      return '⏳';
    default:
      return '❔';
  }
};

const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toTimeString().split(' ')[0]; // Returns HH:MM:SS
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const formatTicketType = (type: string) => {
  switch (type) {
    case 'NON_SUBSCRIPTION':
      return 'Einzelticket';
    case 'SUBSCRIPTION':
      return 'Vertragsverlängerung';
    default:
      return type;
  }
};

export const TicketJobListItem: FC<{ ticketJob: TicketJob }> = ({ ticketJob }) => {
  const { steps, ...ticketJobDetails } = ticketJob;

  const detailPairs = Object.entries(ticketJobDetails).map(([key, value]) => {
    if (value === undefined) {
      return null;
    }

    let displayValue = String(value);
    if (key.endsWith('At')) {
      displayValue = formatDate(value as string);
    }
    if (key === 'state') {
      displayValue = `${stateToEmoji(value as string)}`;
    }
    if (key === 'type') {
      displayValue = formatTicketType(value as string);
    }

    return (
      <div key={`${key}-${ticketJob.id}`} className={styles.detailsPair}>
        <dt>{key}</dt>
        <dd className={key === 'state' ? `${styles.highlight} -${value}` : ''}>
          {displayValue}
        </dd>
      </div>
    );
  });

  // Ensure 4 columns per row
  const rows: React.ReactNode[] = [];
  for (let i = 0; i < detailPairs.length; i += 4) {
    rows.push(
      <div className={styles.detailsRow} key={`row-${i}`}>
        {detailPairs.slice(i, i + 4)}
      </div>
    );
  }

  return (
    <div className={`${styles.ticketJobItem} ${styles[ticketJob.state.toLowerCase()]}`}>
      {rows}
      <div key={`steps-${ticketJob.id}`} className={styles.stepsContainer}>
        <StepListItem steps={steps} />
      </div>
    </div>
  );
};

export const StepListItem: FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <div className={styles.stepsWrapper}>
      {steps.map((step) => (
        <div key={step.id} className={`${styles.stepItem} ${styles[step.state.toLowerCase()]}`}>
          <div className={styles.stepContent}>
            <div className={styles.stepEmoji}>{stateToEmoji(step.state)}</div>
            <div>{formatTime(step.startedAt)}</div>
            <div>{formatTime(step.finishedAt || step.failedAt)}</div>
            <div className={styles.stepType}>{step.type.replace(/_/g, ' ')}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TicketJobList: FC<{ ticketJobs: TicketJob[] }> = ({
  ticketJobs,
}) => {
  return (
    <div className={styles.container}>
      {ticketJobs.map((ticketJob) => (
        <TicketJobListItem key={ticketJob.id} ticketJob={ticketJob} />
      ))}
    </div>
  );
};
