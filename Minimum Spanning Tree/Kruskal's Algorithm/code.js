import { GraphTracer, LogTracer, Randomize } from 'algorithm-visualizer';

const tracer = new GraphTracer({ directed: false, weighted: true });
const logger = new LogTracer();
/* let G = [ // G[i][j] indicates the weight of the path from the i-th node to the j-th node
 [0, 3, 0, 1, 0],
 [5, 0, 1, 2, 4],
 [1, 0, 0, 2, 0],
 [0, 2, 0, 0, 1],
 [0, 1, 3, 0, 0]
 ]; */
const G = Randomize.graph(5, {
  directed: false, weighted: true, ratio: 1, min: 1, max: 9,
});
tracer.set(G).wait();

function kruskal() {
  const vcount = G.length;

  // Preprocess: sort edges by weight.
  const edges = [];
  for (let vi = 0; vi < vcount - 1; vi++) {
    for (let vj = vi + 1; vj < vcount; vj++) {
      edges.push({
        0: vi,
        1: vj,
        weight: G[vi][vj],
      });
    }
  }
  edges.sort((ei, ej) => ei.weight - ej.weight);

  // Give each vertex a tree to decide if they are already in the same tree.
  const t = [];
  for (let i = 0; i < vcount; i++) {
    t[i] = {};
    t[i][i] = true;
  }

  let wsum = 0;
  for (let n = 0; n < vcount - 1 && edges.length > 0;) {
    const e = edges.shift(); // Get the edge of min weight
    tracer.visit(e[0], e[1]).wait();
    if (t[e[0]] === t[e[1]]) {
      // e[0] & e[1] already in the same tree, ignore
      tracer.leave(e[0], e[1]).wait();
      continue;
    }

    // Choose the current edge.
    wsum += e.weight;

    // Merge tree of e[0] & e[1]
    const tmerged = {};
    for (const i in t[e[0]]) tmerged[i] = true;
    for (const i in t[e[1]]) tmerged[i] = true;
    for (const i in tmerged) t[i] = tmerged;

    n += 1;
  }

  logger.print(`The sum of all edges is: ${wsum}`);
}

kruskal();
