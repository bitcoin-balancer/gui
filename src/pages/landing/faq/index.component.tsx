import { memo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/shadcn/components/ui/accordion.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of faq items that will be displayed to start with
const INITIAL_RECORDS = 5;

// the list of commonly asked questions
const FAQ_ITEMS = [
  {
    title: 'What is Balancer?',
    content: (
      <p>
        Balancer is a self-hosted platform that automates a proven trading strategy known as
         "Value Averaging" to help generate passive income by taking advantage of price
          fluctuations. It utilizes a set of indicators and algorithms to adjust your
           Bitcoin holdings based on market conditions.
      </p>
    ),
  },
  {
    title: 'How does Balancer work?',
    content: (
      <p>
        Balancer connects to a pre-configured exchange in real-time and monitors the price of
         Bitcoin. It uses a dynamic moving window to analyze price trends, identifying potential
          price reversals. It also uses a set of indicators to assess the overall market sentiment
           and direction. Based on this analysis, Balancer automatically adjusts your Bitcoin
            holdings by buying or selling at strategic intervals.
      </p>
    ),
  },
  {
    title: 'What is Value Averaging?',
    content: (
      <p>
        Value averaging is a systematic trading strategy. It involves buying Bitcoin when prices
         fall but indicators suggest a likely price reversal, and selling when prices rise sharply.
      </p>
    ),
  },
  {
    title: 'What are the benefits of using Balancer?',
    content: (
      <>
        <p>
          Balancer offers several benefits:
        </p>
        <ul className='mt-2'>
          <li>
            <p>
              <strong>* Automated strategy:</strong> it takes the guesswork out of trading by
               automating a proven strategy, allowing you to focus on your long-term goals.
            </p>
          </li>
          <li>
            <p>
              <strong>* Secure Asset Storage:</strong> Balancer significantly reduces your exchange
               risk by enabling you to store most of your Bitcoin/USD in your cold storage wallet,
                only keeping the minimum required on the exchange for trading.
            </p>
          </li>
          <li>
            <p>
              <strong>* Reduced Risk:</strong> value averaging helps you minimize the impact of
               market fluctuations and reduce overall risk.
            </p>
          </li>
          <li>
            <p>
              <strong>* Long-Term Growth:</strong> tt's designed to help you build wealth steadily
               over time, taking advantage of market trends to maximize potential returns.
            </p>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'How much does Balancer cost?',
    content: (
      <p>
        Balancer is free to use. There are no subscription fees or hidden costs.
      </p>
    ),
  },
  {
    title: 'How secure is Balancer?',
    content: (
      <p>
        Balancer prioritizes security, employing industry-leading protocols, undergoing regular
         security audits, and maintaining a dedicated development team to address vulnerabilities
          and ensure ongoing platform stability. Your data and credentials are protected by advanced
           encryption and security measures, ensuring a safe and trusted trading environment.
      </p>
    ),
  },
  {
    title: 'Is my data secure with Balancer?',
    content: (
      <p>
        Balancer is self-hosted, meaning you control your data and are not reliant on a centralized
         third party. Your data is not stored on servers accessible by others. This fosters greater
          privacy and security, as your data remains under your control.
      </p>
    ),
  },
  {
    title: 'Is Balancer open-source?',
    content: (
      <p>
        Yes, Balancer's code is completely open source, allowing anyone to inspect and audit it for
         security and transparency. This ensures that the platform is built on a foundation of trust
          and accountability.
      </p>
    ),
  },
  {
    title: 'What exchanges does Balancer support?',
    content: (
      <>
        <p>
          Balancer currently supports the following exchanges:
        </p>
        <ul className='mt-2'>
          <li>
            <p><strong>* Binance</strong></p>
          </li>
          <li>
            <p><strong>* Bitfinex (partially)</strong></p>
          </li>
          <li>
            <p><strong>* Coinbase (planned)</strong></p>
          </li>
          <li>
            <p><strong>* Kraken (partially)</strong></p>
          </li>
          <li>
            <p><strong>* OKX (planned)</strong></p>
          </li>
        </ul>
        <p>
          More more information,
          visit <a
            href='https://github.com/bitcoin-balancer/.github/blob/main/profile/sections/supported-exchanges/index.md'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sky-700'
          >Supported exchanges</a>.
        </p>
      </>
    ),
  },
  {
    title: 'How do I get started with Balancer?',
    content: (
      <p>
        Find detailed instructions on how to run Balancer
         in <a
          href='https://github.com/bitcoin-balancer/cli'
          target='_blank'
          rel='noopener noreferrer'
          className='text-sky-700'>balancer/cli</a>
      </p>
    ),
  },
  {
    title: 'Can I use Balancer with other trading strategies?',
    content: (
      <p>
        While Balancer focuses on value averaging, it is a flexible platform. You can adjust your
         trading parameters and customize your approach to fit your personal investment goals.
      </p>
    ),
  },
  {
    title: 'How do I contact support?',
    content: (
      <p>
        Balancer is a free-to-use open-source project, and therefore, at this point, it has no
         customer support. If you are having issues running the platform, feel free to open a GitHub
          issue. For any other inquiries, you can get in touch
           via <strong>jesusgraterol.dev@protonmail.com</strong>.
      </p>
    ),
  },
];




/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Frequently Asked Questions
 * Component in charge of displaying the most common questions asked by users.
 */
const FrequentlyAskedQuestions = memo(() => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [visibleRecords, setVisibleRecords] = useState<number>(INITIAL_RECORDS);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <div
      className='w-full flex justify-center items-start'
    >
      <section
        className='w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 p-3'
      >
        <header className='text-center'>
          <h2
            className='text-center text-4xl sm:text-5xl font-bold'
          >FAQ</h2>
          <p className='text-xs sm:text-sm mt-2 text-light'>
            Answers to common questions
          </p>
        </header>

        <Accordion type='single' collapsible className='w-full mt-2'>
          {
            FAQ_ITEMS.slice(0, visibleRecords).map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className='animate-in fade-in'
              >
                <AccordionTrigger>
                  <p className='text-left'>{item.title}</p>
                </AccordionTrigger>
                <AccordionContent>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>

        {
          visibleRecords === INITIAL_RECORDS
          && (
            <Button
              variant='ghost'
              className='w-full mt-2'
              onClick={() => setVisibleRecords(100)}
            >View all</Button>
          )
        }
      </section>
    </div>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default FrequentlyAskedQuestions;
