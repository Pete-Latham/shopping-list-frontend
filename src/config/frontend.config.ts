import axios from 'axios';

export interface FrontendConfig {
  apiUrl: string;
  enableMockApi: boolean;
}

class FrontendConfigService {
  private static instance: FrontendConfigService;
  private cachedConfig: FrontendConfig | null = null;
  private readonly cacheExpiry = 10 * 60 * 1000; // 10 minutes
  private lastFetchTime = 0;

  private constructor() {
    // console.log('[CONFIG] Frontend config service created');
  }

  static getInstance(): FrontendConfigService {
    if (!FrontendConfigService.instance) {
      FrontendConfigService.instance = new FrontendConfigService();
    }
    return FrontendConfigService.instance;
  }

  async getConfig(): Promise<FrontendConfig> {
    const now = Date.now();

    // Return cached config if still valid
    if (this.cachedConfig && (now - this.lastFetchTime) < this.cacheExpiry) {
      return this.cachedConfig;
    }

    // Try to fetch configuration from backend first
    try {
      // console.log('[CONFIG] Fetching frontend configuration from backend...');
      
      const response = await axios.get('/config/frontend', {
        baseURL: import.meta.env.VITE_API_URL || '/api',
        timeout: 5000,
      });

      const backendConfig = response.data;
      const frontendConfig: FrontendConfig = {
        apiUrl: backendConfig.apiUrl || import.meta.env.VITE_API_URL || '/api',
        enableMockApi: backendConfig.enableMockApi || import.meta.env.VITE_USE_MOCK_API === 'true',
      };

      // Cache the config
      this.cachedConfig = frontendConfig;
      this.lastFetchTime = now;

      // console.log('[CONFIG] Successfully fetched configuration from backend:', {
      //   apiUrl: frontendConfig.apiUrl,
      //   mockApi: frontendConfig.enableMockApi
      // });

      return frontendConfig;

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn('[CONFIG] Failed to fetch from backend, using environment variables:', message);
      
      const envConfig = this.getConfigFromEnv();
      
      // Cache environment variables too
      this.cachedConfig = envConfig;
      this.lastFetchTime = now;
      
      // console.log('[CONFIG] Using environment variables:', {
      //   apiUrl: envConfig.apiUrl,
      //   mockApi: envConfig.enableMockApi
      // });
      
      return envConfig;
    }
  }

  private getConfigFromEnv(): FrontendConfig {
    return {
      apiUrl: import.meta.env.VITE_API_URL || '/api',
      enableMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
    };
  }

  // Helper method to get individual config values
  async getConfigValue<K extends keyof FrontendConfig>(key: K): Promise<FrontendConfig[K]> {
    const config = await this.getConfig();
    return config[key];
  }

  // Method to refresh config manually
  async refreshConfig(): Promise<void> {
    this.cachedConfig = null;
    await this.getConfig();
  }
}

// Export singleton instance
export const frontendConfig = FrontendConfigService.getInstance();
