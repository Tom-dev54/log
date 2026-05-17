import { useStore } from '../store';
import { selectRetroReady } from '../store/selectors';

export function useRetroReady() {
  const contents = useStore((s) => s.contents);
  return selectRetroReady(contents);
}
