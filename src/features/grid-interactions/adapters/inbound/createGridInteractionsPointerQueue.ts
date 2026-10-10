/*** Serializes native responder measurements and invalidates work from canceled interaction lifecycles. */
export function createGridInteractionsPointerQueue() {
  let active = true;
  let generation = 0;
  let measuring = false;
  let pending: readonly GridInteractionPointerWork[] = [];

  const processNext = () => {
    if (measuring) return;
    const pointerWork = pending.at(0);
    if (pointerWork === undefined) return;
    pending = pending.slice(1);
    measuring = true;
    let settled = false;
    measureSurfaceOrigin(pointerWork.surface, (origin) => {
      if (settled) return;
      settled = true;
      try {
        if (active && pointerWork.generation === generation) {
          pointerWork.handleOrigin(origin);
        }
      } finally {
        measuring = false;
        processNext();
      }
    });
  };

  return {
    activate: () => {
      active = true;
    },
    enqueue: (
      surface: GridInteractionSurface,
      handleOrigin: (origin: GridInteractionSurfaceOrigin) => void,
    ) => {
      if (!active) return;
      pending = [...pending, { generation, handleOrigin, surface }];
      processNext();
    },
    cancel: () => {
      generation += 1;
      pending = [];
    },
    dispose: () => {
      active = false;
      generation += 1;
      pending = [];
    },
  };
}

interface GridInteractionPointerWork {
  readonly generation: number;
  readonly handleOrigin: (origin: GridInteractionSurfaceOrigin) => void;
  readonly surface: GridInteractionSurface;
}

interface GridInteractionSurface {
  readonly getBoundingClientRect?: () => Pick<DOMRect, 'left' | 'top'>;
  readonly measureInWindow?: (callback: (x: number, y: number) => void) => void;
}

interface GridInteractionSurfaceOrigin {
  readonly x: number;
  readonly y: number;
}

/*** Resolves the current surface origin through RNW DOM geometry or native asynchronous measurement. */
function measureSurfaceOrigin(
  surface: GridInteractionSurface,
  onOrigin: (origin: GridInteractionSurfaceOrigin) => void,
) {
  const rect = surface.getBoundingClientRect?.();
  if (rect) {
    onOrigin({ x: rect.left, y: rect.top });
    return;
  }
  if (surface.measureInWindow !== undefined) {
    surface.measureInWindow((x, y) => onOrigin({ x, y }));
    return;
  }
  onOrigin({ x: 0, y: 0 });
}
