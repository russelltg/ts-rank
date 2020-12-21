import React, { useEffect, useState } from 'react';
import './App.css';
import songs from './songs';

type CellState = 'Unknown' | 'Less' | 'Greater';

function invert(cs: CellState): CellState {
  switch (cs) {
    case 'Unknown': return 'Unknown';
    case 'Less': return 'Greater';
    case 'Greater': return 'Less';
  }
}

function startingArray(): number[] {
  return Array(songs.length).fill(1).map((x, y) => x + y - 1)
}

function mergeSort(toSort: number[], edges: CellState[][]): [number, number] | undefined {
  if (toSort.length <= 1) { return undefined; }

  const mid = Math.floor(toSort.length / 2);
  let left = mergeSort(toSort.slice(0, mid), edges);
  if (left !== undefined) { return left; }
  let right = mergeSort(toSort.slice(mid), edges);
  if (right !== undefined) { return right; }

  // merge
  let leftPtr = 0;
  let rightPtr = mid;

  let out = Array<number>(toSort.length);

  while (leftPtr !== mid && rightPtr !== toSort.length) {
    const edge = edges[toSort[leftPtr]][toSort[rightPtr]];

    if (edge === 'Unknown') {
      return [toSort[leftPtr], toSort[rightPtr]];
    }

    if (edge === 'Less') {
      out[leftPtr + rightPtr - mid] = toSort[leftPtr];
      ++leftPtr;
    } else if (edge === 'Greater') {
      out[leftPtr + rightPtr - mid] = toSort[rightPtr];
      ++rightPtr;
    }
  }

  while (leftPtr !== mid) {
    out[leftPtr + rightPtr - mid] = toSort[leftPtr];
    ++leftPtr;
  }

  while (rightPtr !== toSort.length) {
    out[leftPtr + rightPtr - mid] = toSort[rightPtr];
    ++rightPtr;
  }

  for (let i = 0; i < toSort.length; ++i) {
    toSort[i] = out[i];
  }

  return undefined;
}

function nextComp(edges: CellState[][]): [number, number] | undefined {
  let order = startingArray();
  return mergeSort(order, edges);
}

function App() {
  const [edges, setEdges] = useState(Array(songs.length).fill(0).map(_ => Array(songs.length).fill('Unknown' as CellState)))

  const thisEdge = nextComp(edges);
  if (thisEdge === undefined) {
    let order = startingArray();
    mergeSort(order, edges);

    return <table>
      {order.map((idx, i) => <tr key={i}><td>{i + 1}</td><td>{songs[idx]}</td></tr>)}
    </table >
  }

  const click = (st: CellState) => {
    const lo = Math.min(thisEdge[0], thisEdge[1]);
    const hi = Math.max(thisEdge[0], thisEdge[1]);
    setEdges(edges => [
      ...edges.slice(0, lo),
      [...edges[lo].slice(0, hi), st, ...edges[lo].slice(hi + 1)],
      ...edges.slice(lo + 1, hi),
      [...edges[hi].slice(0, lo), invert(st), ...edges[hi].slice(lo + 1)],
      ...edges.slice(hi + 1),
    ])
  };

  return (
    <div>
      <button onClick={() => click('Greater')}>{songs[thisEdge[0]]}</button>
      <button onClick={() => click('Less')}>{songs[thisEdge[1]]}</button>
    </div>
  );
}

export default App;
