"use client";

import { AppProgressBar as NProgressBar } from 'next-nprogress-bar';

export default function ProgressBar() {
  return (
    <NProgressBar
      height="3px"
      color="#006c49"
      options={{ showSpinner: false, speed: 400, minimum: 0.1 }}
      shallowRouting
    />
  );
}
