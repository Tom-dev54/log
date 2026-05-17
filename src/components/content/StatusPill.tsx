import React from 'react';
import { ContentStatus } from '../../store/types';
import { STATUS_CONFIG } from '../../utils/constants';
import { Badge } from '../ui/Badge';

export function StatusPill({ status }: { status: ContentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <Badge label={cfg.label} color={cfg.color} />;
}
