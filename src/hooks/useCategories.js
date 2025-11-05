import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export function useCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, 'Categories'));
        // Ensure Firestore document ID is preserved (d.data() might have an 'id' field that overwrites it)
        const list = snap.docs.map((d) => {
          const data = d.data();
          return { ...data, id: d.id }; // Firestore doc ID takes precedence
        });
        list.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
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

  // Memoized alphabetical categories
  const categories = useMemo(() => data, [data]);

  return { categories, loading, error };
}


