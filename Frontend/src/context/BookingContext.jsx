import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [journey, setJourney] = useState(null);
  // journey = { from, to, startDate, endDate }

  return (
    <BookingContext.Provider value={{ journey, setJourney }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
