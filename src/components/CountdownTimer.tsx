
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
    <div className="bg-white py-12">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold text-navy mb-8">Event Starts In</h3>
        <div className="flex justify-center space-x-8">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="bg-navy text-white rounded-lg p-6 min-w-[80px]">
                <div className="text-3xl font-bold">{item.value.toString().padStart(2, '0')}</div>
              </div>
              <p className="text-navy font-semibold mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
