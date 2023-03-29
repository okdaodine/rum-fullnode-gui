export function createPageLoadingStore() {
  return {
    open: true,

    show() {
      this.open = true;
    },

    hide() {
      this.open = false;
    }
  };
}
