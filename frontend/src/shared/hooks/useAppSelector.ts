import type { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

// export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector)
// export const useAppSelector = (selector: (state: RootState) => any) => useSelector(selector);
export const useAppSelector = useSelector.withTypes<RootState>();