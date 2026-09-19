declare module 'cytoscape-elk/src/layout.js' {
  interface ElkLayoutInstance {
    readonly options: Record<string, unknown>;
    run(): ElkLayoutInstance;
    stop(): ElkLayoutInstance;
    destroy(): ElkLayoutInstance;
  }

  const Layout: {
    new (options: Record<string, unknown>): ElkLayoutInstance;
    readonly prototype: ElkLayoutInstance;
  };

  export default Layout;
}
