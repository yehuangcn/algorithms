import { Array1DTracer, ChartTracer, LogTracer, Randomize } from 'algorithm-visualizer';

const chart = new ChartTracer();
const tracer = new Array1DTracer().chart(chart);
const logger = new LogTracer();
const D = Randomize.array1D(15);
tracer.set(D).wait();

logger.print(`original array = [${D.join(', ')}]`);

function partition(D, low, high) {
  let i;
  let j;
  let s;
  while (high > low) {
    i = low;
    j = high;
    s = D[low];
    while (i < j) {
      tracer.select(high).select(low).wait();
      while (D[j] > s) {
        tracer.select(j).wait();
        tracer.deselect(j);
        j--;
      }
      D[i] = D[j];
      tracer.notify(i, D[j]).wait().denotify(i);
      while (s >= D[i] && i < j) {
        tracer.select(i).wait();
        tracer.deselect(i);
        i++;
      }
      D[j] = D[i];
      tracer.notify(j, D[i]).wait().denotify(j);
      tracer.deselect(high).deselect(low);
    }
    D[i] = s;
    tracer.notify(i, s).wait();
    tracer.denotify(i);
    partition(D, low, i - 1);
    low = i + 1;
  }
}

function quicksort(D) {
  partition(D, 0, D.length - 1);
}

quicksort(D);
logger.print(`sorted array = [${D.join(', ')}]`);
