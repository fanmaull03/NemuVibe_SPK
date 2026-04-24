import { createContext, useState, useContext } from 'react';

export const PreferenceContext = createContext();

export function PreferenceProvider({ children }) {
  const [category, setCategory] = useState('wfc');
  const [weights, setWeights] = useState({
    w1: 50, w2: 50, w3: 50, w4: 50, w5: 50, w6: 50
  });
  const [results, setResults] = useState([]);
  const [hasSetPreferences, setHasSetPreferences] = useState(false);

  return (
    <PreferenceContext.Provider value={{
      category, setCategory,
      weights, setWeights,
      results, setResults,
      hasSetPreferences, setHasSetPreferences
    }}>
      {children}
    </PreferenceContext.Provider>
  );
}

export function usePreference() {
  return useContext(PreferenceContext);
}
