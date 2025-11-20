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
        // Use the 'id' field from within the document data, not the Firestore document ID
        const list = snap.docs.map((d) => {
          const data = d.data();
          // Preserve the document's 'id' field if it exists, otherwise use Firestore doc ID as fallback
          return { ...data, id: data.id ?? d.id };
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


