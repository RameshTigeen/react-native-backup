import React from 'react';

import SliderWeb from './src/SliderWeb';

export default function App() {
  // if (process.env.APP_ENV === 'development') {
  //   console.log('Running in development mode');
  // } else if (process.env.APP_ENV === 'staging') {
  //   console.log('Running in staging mode');
  // } else if (process.env.APP_ENV === 'production') {
  //   console.log('Running in production mode');
  // }
  // console.log(`API URL: ${API_URL}`);

  return (
    <SliderWeb
      startRange={1}
      endRange={100}
      start={40}
      end={90}
      onChange={function ({start, end}: {start: number; end: number}): void {
        console.log(start, end);
      }}
    />
  );
}
