import store from 'store2';

interface apiConfig {
  baseURL: string
  jwt : string
}

export function createApiConfigStore() {
  return {
    apiConfig: store('apiConfig') as null | apiConfig,

    apiConfigHistory: (store('apiConfigHistory') || []) as apiConfig[],

    get ids() {
      return this.apiConfigHistory.map(apiConfig => `${apiConfig.baseURL}${apiConfig.jwt}`);
    },
    
    setApiConfig(apiConfig: null | apiConfig) {
      store('apiConfig', apiConfig);
    },

    addApiConfigToHistory(apiConfig: apiConfig) {
      if (!this.ids.includes(`${apiConfig.baseURL}${apiConfig.jwt}`)) {
        store('apiConfigHistory', [
          apiConfig,
          ...this.apiConfigHistory,
        ]);
      }
    },

    removeApiConfigToHistory(apiConfig: apiConfig) {
      this.apiConfigHistory = this.apiConfigHistory.filter(item => `${item.baseURL}${item.jwt}` !== `${apiConfig.baseURL}${apiConfig.jwt}`)
      store('apiConfigHistory', this.apiConfigHistory);
    },
  };
}
