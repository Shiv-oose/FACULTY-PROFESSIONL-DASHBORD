import { React, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';

interface NetworkNode {
  id: string;
  name: string;
  group: string;
  publications: number;
  color: string;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

interface D3NetworkGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export default function D3NetworkGraph({ nodes, links }: D3NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create gradient definitions
    const defs = svg.append('defs');
    nodes.forEach((node, i) => {
      const gradient = defs
        .append('radialGradient')
        .attr('id', `gradient-${i}`)
        .attr('cx', '30%')
        .attr('cy', '30%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', node.color)
        .attr('stop-opacity', 1);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', node.color)
        .attr('stop-opacity', 0.6);
    });

    // Create container group
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Draw links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value) * 2)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any
      );

    // Add glow effect
    node
      .append('circle')
      .attr('r', (d: any) => 20 + d.publications * 2)
      .attr('fill', (d: any, i: number) => `url(#gradient-${i})`)
      .attr('filter', 'url(#glow)');

    // Add border circle
    node
      .append('circle')
      .attr('r', (d: any) => 20 + d.publications * 2)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.8);

    // Add text labels
    node
      .append('text')
      .text((d: any) => d.name.split(' ')[1])
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => 25 + d.publications * 2 + 15)
      .attr('fill', '#F0F0F0')
      .attr('font-size', '12px')
      .attr('font-weight', '500');

    // Add publication count
    node
      .append('text')
      .text((d: any) => d.publications)
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('fill', '#0F1419')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace');

    // Add glow filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Add hover effects
    node
      .on('mouseover', function (event, d: any) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', (d: any) => 25 + d.publications * 2);

        // Highlight connected links
        link
          .transition()
          .duration(200)
          .attr('stroke-opacity', (l: any) =>
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.2
          )
          .attr('stroke-width', (l: any) =>
            l.source.id === d.id || l.target.id === d.id
              ? Math.sqrt(l.value) * 3
              : Math.sqrt(l.value) * 2
          );

        // Show tooltip
        showTooltip(event, d);
      })
      .on('mouseout', function () {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', (d: any) => 20 + d.publications * 2);

        link
          .transition()
          .duration(200)
          .attr('stroke-opacity', 0.6)
          .attr('stroke-width', (d: any) => Math.sqrt(d.value) * 2);

        hideTooltip();
      });

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'network-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#16213E')
      .style('color', '#F0F0F0')
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    function showTooltip(event: any, d: any) {
      tooltip
        .style('visibility', 'visible')
        .html(
          `
          <div style="font-weight: bold; margin-bottom: 4px;">${d.name}</div>
          <div style="color: #A0A0A0;">Field: ${d.group}</div>
          <div style="color: #A0A0A0;">Collaborations: ${d.publications}</div>
        `
        )
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 28 + 'px');
    }

    function hideTooltip() {
      tooltip.style('visibility', 'hidden');
    }

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [nodes, links]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
    >
      <svg ref={svgRef} className="w-full h-full" />
    </motion.div>
  );
}