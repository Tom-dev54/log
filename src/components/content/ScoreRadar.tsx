import React from 'react';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { ContentScore } from '../../store/types';
import { SCORE_DIMENSIONS } from '../../utils/constants';

interface ScoreRadarProps {
  score: ContentScore;
  size?: number;
}

export function ScoreRadar({ score, size = 200 }: ScoreRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;
  const n = SCORE_DIMENSIONS.length;
  const keys = SCORE_DIMENSIONS.map((d) => d.key);
  const labels = SCORE_DIMENSIONS.map((d) => d.label);

  function angle(i: number) {
    return (i * 2 * Math.PI) / n - Math.PI / 2;
  }

  function point(i: number, value: number): [number, number] {
    const a = angle(i);
    const ratio = value / 10;
    return [cx + r * ratio * Math.cos(a), cy + r * ratio * Math.sin(a)];
  }

  const gridLevels = [2, 4, 6, 8, 10];

  const polygonPoints = keys
    .map((k, i) => point(i, score[k]).join(','))
    .join(' ');

  return (
    <Svg width={size} height={size}>
      {/* grid */}
      {gridLevels.map((lvl) => {
        const pts = keys
          .map((_, i) => point(i, lvl).join(','))
          .join(' ');
        return (
          <Polygon
            key={lvl}
            points={pts}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        );
      })}

      {/* axes */}
      {keys.map((_, i) => {
        const [x, y] = point(i, 10);
        return (
          <Line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        );
      })}

      {/* score polygon */}
      <Polygon
        points={polygonPoints}
        fill="rgba(255,45,85,0.2)"
        stroke="#FF2D55"
        strokeWidth={2}
      />

      {/* dots */}
      {keys.map((k, i) => {
        const [x, y] = point(i, score[k]);
        return <Circle key={k} cx={x} cy={y} r={3} fill="#FF2D55" />;
      })}

      {/* labels */}
      {labels.map((lbl, i) => {
        const a = angle(i);
        const lx = cx + (r + 20) * Math.cos(a);
        const ly = cy + (r + 20) * Math.sin(a);
        return (
          <SvgText
            key={lbl}
            x={lx}
            y={ly}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            fill="#6B7280"
            fontWeight="600"
          >
            {lbl}
          </SvgText>
        );
      })}
    </Svg>
  );
}
