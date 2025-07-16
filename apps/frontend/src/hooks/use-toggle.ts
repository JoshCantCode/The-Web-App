'use client'

import { useCallback, useState } from 'react';

export function useToggle<T>(values: T[]): [T, () => void] {
	const [index, setIndex] = useState(0);

	const toggle = useCallback(() => {
		setIndex(prev => (prev + 1) % values.length);
	}, [values.length]);

	return [values[index], toggle];
}