import store from 'store2';

export interface IApiConfig {
  baseURL: string
  jwt : string
}

export function createApiConfigStore() {
  return {
    apiConfig: store('apiConfig') as null | IApiConfig,

    apiConfigHistory: (store('apiConfigHistory') || []) as IApiConfig[],

    get ids() {
      return this.apiConfigHistory.map(apiConfig => `${apiConfig.baseURL}${apiConfig.jwt}`);
    },
    
    setApiConfig(apiConfig: null | IApiConfig) {
      store('apiConfig', apiConfig);
    },

    addApiConfigToHistory(apiConfig: IApiConfig) {
      if (!this.ids.includes(`${apiConfig.baseURL}${apiConfig.jwt}`)) {
        store('apiConfigHistory', [
          apiConfig,
          ...this.apiConfigHistory,
        ]);
      }
    },

    removeApiConfigToHistory(apiConfig: IApiConfig) {
      this.apiConfigHistory = this.apiConfigHistory.filter(item => `${item.baseURL}${item.jwt}` !== `${apiConfig.baseURL}${apiConfig.jwt}`)
      store('apiConfigHistory', this.apiConfigHistory);
    },
  };
}
