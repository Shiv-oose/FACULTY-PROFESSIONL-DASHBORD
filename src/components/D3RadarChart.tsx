import { React, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';

interface SkillData {
  skill: string;
  current: number;
  target: number;
}

interface D3RadarChartProps {
  data: SkillData[];
}

export default function D3RadarChart({ data }: D3RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 80;

    // Number of axes
    const numAxes = data.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    // Create scales
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Create gradients
    const defs = svg.append('defs');

    // Gradient for current level
    const currentGradient = defs
      .append('linearGradient')
      .attr('id', 'radar-current-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    currentGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#9D4EDD')
      .attr('stop-opacity', 0.7);

    currentGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#7B2CBF')
      .attr('stop-opacity', 0.5);

    // Gradient for target level
    const targetGradient = defs
      .append('linearGradient')
      .attr('id', 'radar-target-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    targetGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00D9FF')
      .attr('stop-opacity', 0.3);

    targetGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00E5CC')
      .attr('stop-opacity', 0.2);

    // Glow filter
    const glowFilter = defs.append('filter').attr('id', 'radar-glow');
    glowFilter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Draw circular grid
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;

      g.append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', 1);

      // Add level labels
      g.append('text')
        .attr('x', 5)
        .attr('y', -levelRadius)
        .attr('fill', '#A0A0A0')
        .attr('font-size', '10px')
        .text((i * 20).toString());
    }

    // Draw axes
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Axis line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-width', 1);

      // Axis label
      const labelX = Math.cos(angle) * (radius + 40);
      const labelY = Math.sin(angle) * (radius + 40);

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#F0F0F0')
        .attr('font-size', '13px')
        .attr('font-weight', '500')
        .text(d.skill);
    });

    // Helper function to create path data
    function createRadarPath(values: number[]) {
      return d3
        .lineRadial()
        .angle((d, i) => angleSlice * i)
        .radius((d: any) => rScale(d))
        .curve(d3.curveLinearClosed)(values as any);
    }

    // Draw target (aspirational) area
    const targetValues = data.map((d) => d.target);
    const targetPath = g
      .append('path')
      .datum(targetValues)
      .attr('d', createRadarPath(targetValues) as string)
      .attr('fill', 'url(#radar-target-gradient)')
      .attr('stroke', '#00D9FF')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0)
      .attr('transform', 'rotate(-90)');

    targetPath
      .transition()
      .duration(1000)
      .delay(300)
      .attr('opacity', 1);

    // Draw current level area
    const currentValues = data.map((d) => d.current);
    const currentPath = g
      .append('path')
      .datum(currentValues)
      .attr('d', createRadarPath(currentValues) as string)
      .attr('fill', 'url(#radar-current-gradient)')
      .attr('stroke', '#9D4EDD')
      .attr('stroke-width', 3)
      .attr('filter', 'url(#radar-glow)')
      .attr('opacity', 0)
      .attr('transform', 'rotate(-90)');

    currentPath
      .transition()
      .duration(1000)
      .delay(500)
      .attr('opacity', 1);

    // Add data points on current level
    const points = g
      .selectAll('.data-point')
      .data(data)
      .join('g')
      .attr('class', 'data-point')
      .attr('transform', (d, i) => {
        const angle = angleSlice * i;
        const r = rScale(d.current);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return `translate(${x}, ${y})`;
      });

    points
      .append('circle')
      .attr('r', 0)
      .attr('fill', '#9D4EDD')
      .attr('stroke', '#F0F0F0')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#radar-glow)')
      .transition()
      .duration(500)
      .delay((d, i) => 800 + i * 100)
      .attr('r', 6);

    // Add interactive hover on axes
    const hoverAreas = g
      .selectAll('.hover-area')
      .data(data)
      .join('path')
      .attr('class', 'hover-area')
      .attr('d', (d, i) => {
        const angle1 = angleSlice * i - angleSlice / 2;
        const angle2 = angleSlice * i + angleSlice / 2;
        
        const path = d3.path();
        path.moveTo(0, 0);
        path.arc(0, 0, radius + 20, angle1 - Math.PI / 2, angle2 - Math.PI / 2);
        path.closePath();
        return path.toString();
      })
      .attr('fill', 'transparent')
      .attr('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', 'rgba(157, 78, 221, 0.1)');
        showTooltip(event, d);
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', 'transparent');
        hideTooltip();
      });

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'radar-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#16213E')
      .style('color', '#F0F0F0')
      .style('padding', '12px')
      .style('border-radius', '12px')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    function showTooltip(event: any, d: SkillData) {
      const gap = d.target - d.current;
      const percentage = ((d.current / d.target) * 100).toFixed(0);
      
      tooltip
        .style('visibility', 'visible')
        .html(
          `
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${d.skill}</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #A0A0A0;">Current:</span>
            <span style="color: #9D4EDD; font-weight: bold;">${d.current}/100</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #A0A0A0;">Target:</span>
            <span style="color: #00D9FF; font-weight: bold;">${d.target}/100</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #A0A0A0;">Gap:</span>
            <span style="color: ${gap > 15 ? '#FFA500' : '#00B894'};">${gap} points</span>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="color: #A0A0A0; font-size: 11px;">Progress: ${percentage}%</div>
            <div style="height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; margin-top: 4px; overflow: hidden;">
              <div style="height: 100%; background: linear-gradient(90deg, #9D4EDD, #00D9FF); width: ${percentage}%;"></div>
            </div>
          </div>
        `
        )
        .style('left', event.pageX + 15 + 'px')
        .style('top', event.pageY - 28 + 'px');
    }

    function hideTooltip() {
      tooltip.style('visibility', 'hidden');
    }

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      <svg ref={svgRef} className="w-full h-full" />
    </motion.div>
  );
}