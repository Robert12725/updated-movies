import { useState, useEffect } from "react";
// იმპორტირება JSON ფაილიდან
import moviesData from "./movies.json"; 

export default function UseMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // შეცდომის სტატუსი

  useEffect(() => {
    // რეალური API მოტანის სიმულაცია
    const fetchData = () => {
      setLoading(true);
      setError(null); // ვასუფთავებთ შეცდომებს

      // ვბაძავთ ქსელურ დაყოვნებას (500ms)
      const timer = setTimeout(() => {
        try {
          if (!moviesData || moviesData.length === 0) {
            throw new Error("Movie data is empty or corrupted.");
          }
          
          setMovies(moviesData);
          setLoading(false);
          
        } catch (e) {
          console.error("Data loading error:", e);
          setError(e);
          setLoading(false);
        }
      }, 500); 

      return () => clearTimeout(timer); // Cleanup function
    };

    fetchData();
  }, []); // ცარიელი მასივი იმისთვის, რომ კოდი მხოლოდ ერთხელ გაეშვას ჩატვირთვისას

  // ვაბრუნებთ სტატუსებს
  return { movies, loading, error };
}