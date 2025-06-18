
import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('December 11, 2025 09:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="container text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 font-biondi">Event Starts In</h3>
        <div className="flex justify-center space-x-3 sm:space-x-4 lg:space-x-6">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="bg-primary text-white rounded-lg p-3 sm:p-4 lg:p-6 min-w-[60px] sm:min-w-[70px] lg:min-w-[80px]">
                <div className="text-xl sm:text-2xl lg:text-[32px] font-biondi font-bold text-white">{item.value.toString().padStart(2, '0')}</div>
              </div>
              <p className="text-accent font-semibold mt-2 text-xs sm:text-sm lg:text-[14px] font-biondi">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
