import React from 'react';

const iconProps = {
  className: "w-full h-full",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 2,
  stroke: "currentColor"
};

export const TimerIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

export const ChartBarIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
);

export const ChatBubbleLeftRightIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.05 1.05 0 0 0-1.485 0L12 14.807l-1.565-1.565a1.05 1.05 0 0 0-1.485 0L6.22 15.97a2.1 2.1 0 0 1-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097a6.012 6.012 0 0 1 11.028 0Z" /></svg>
);

export const Cog6ToothIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226a9 9 0 0 1 2.592 0c.55.223 1.02.684 1.11 1.226.09.542-.14 1.12-.59 1.528a9 9 0 0 1-3.132 2.198c-.55.223-1.19.02-1.59-.44a9 9 0 0 1-3.132-2.198c-.45-.408-.68-.986-.59-1.528ZM12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /></svg>
);

export const PlayIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
);

export const PauseIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>
);

export const PlusIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);

export const PaperAirplaneIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
);
