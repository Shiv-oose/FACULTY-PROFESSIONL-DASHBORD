import { React, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';

interface BubbleData {
  id: string;
  title: string;
  citations: number;
  year: number;
  tier: string;
  impact: number;
}

interface D3BubbleChartProps {
  data: BubbleData[];
  onBubbleClick?: (item: BubbleData) => void;
}

export default function D3BubbleChart({ data, onBubbleClick }: D3BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create color scale based on tier
    const colorScale = d3
      .scaleOrdinal()
      .domain(['top', 'high', 'medium'])
      .range(['#FFB703', '#00D9FF', '#9D4EDD']);

    // Create size scale based on citations
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.citations) || 100])
      .range([20, 80]);

    // Create pack layout
    const pack = d3
      .pack()
      .size([width - 40, height - 40])
      .padding(5);

    // Create hierarchy
    const root = d3
      .hierarchy({ children: data } as any)
      .sum((d: any) => d.citations || 1);

    const nodes = pack(root).leaves();

    // Create gradient definitions
    const defs = svg.append('defs');
    
    // Create gradients for each tier
    ['top', 'high', 'medium'].forEach((tier) => {
      const color = colorScale(tier) as string;
      const gradient = defs
        .append('radialGradient')
        .attr('id', `bubble-gradient-${tier}`)
        .attr('cx', '30%')
        .attr('cy', '30%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.rgb(color).brighter(0.5).toString())
        .attr('stop-opacity', 1);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.8);
    });

    // Add glow filter
    const filter = defs.append('filter').attr('id', 'bubble-glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create container group with margin
    const g = svg.append('g').attr('transform', 'translate(20, 20)');

    // Create bubbles group
    const bubble = g
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .attr('cursor', 'pointer')
      .on('click', (event, d: any) => {
        if (onBubbleClick) {
          onBubbleClick(d.data);
        }
      });

    // Add circles with gradient
    bubble
      .append('circle')
      .attr('r', 0)
      .attr('fill', (d: any) => `url(#bubble-gradient-${d.data.tier})`)
      .attr('filter', 'url(#bubble-glow)')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .attr('r', (d: any) => d.r);

    // Add border circles
    bubble
      .append('circle')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => colorScale(d.data.tier) as string)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .attr('r', (d: any) => d.r);

    // Add citation count text
    bubble
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('fill', '#0F1419')
      .attr('font-size', (d: any) => Math.min(d.r / 3, 16) + 'px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .attr('opacity', 0)
      .text((d: any) => d.data.citations)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50 + 1000)
      .attr('opacity', 1);

    // Add year text
    bubble
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('fill', '#0F1419')
      .attr('font-size', (d: any) => Math.min(d.r / 4, 12) + 'px')
      .attr('opacity', 0)
      .text((d: any) => d.data.year)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50 + 1000)
      .attr('opacity', 0.7);

    // Add hover effects
    bubble
      .on('mouseover', function (event, d: any) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', d.r * 1.1)
          .attr('filter', 'url(#bubble-glow) brightness(1.2)');

        d3.select(this)
          .selectAll('circle')
          .filter(function(this: any) { return d3.select(this).attr('stroke'); })
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .attr('stroke-opacity', 1);

        showTooltip(event, d.data);
      })
      .on('mouseout', function (event, d: any) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', d.r)
          .attr('filter', 'url(#bubble-glow)');

        d3.select(this)
          .selectAll('circle')
          .filter(function(this: any) { return d3.select(this).attr('stroke'); })
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.6);

        hideTooltip();
      });

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'bubble-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#16213E')
      .style('color', '#F0F0F0')
      .style('padding', '12px')
      .style('border-radius', '12px')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('max-width', '300px');

    function showTooltip(event: any, d: any) {
      tooltip
        .style('visibility', 'visible')
        .html(
          `
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">${d.title}</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #A0A0A0;">Citations:</span>
            <span style="color: #00D9FF; font-weight: bold;">${d.citations}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #A0A0A0;">Year:</span>
            <span>${d.year}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #A0A0A0;">Impact Factor:</span>
            <span style="color: #FFB703; font-weight: bold;">${d.impact}</span>
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <svg ref={svgRef} className="w-full h-full" />
    </motion.div>
  );
}