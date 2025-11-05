import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export function useFoods() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, 'Foods'));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (mounted) setData(list);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, []);

  const foods = useMemo(() => data, [data]);
  return { foods, loading, error };
}


