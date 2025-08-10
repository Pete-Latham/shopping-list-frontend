import { InfisicalSDK, LogLevel } from '@infisical/sdk';

export interface FrontendSecrets {
  apiUrl: string;
  enableMockApi: boolean;
}

class InfisicalConfigService {
  private static instance: InfisicalConfigService;
  private infisicalClient: InfisicalSDK | null = null;
  private cachedSecrets: FrontendSecrets | null = null;
  private readonly cacheExpiry = 10 * 60 * 1000; // 10 minutes (longer for frontend)
  private lastFetchTime = 0;

  private constructor() {
    this.initializeInfisical();
  }

  static getInstance(): InfisicalConfigService {
    if (!InfisicalConfigService.instance) {
      InfisicalConfigService.instance = new InfisicalConfigService();
    }
    return InfisicalConfigService.instance;
  }

  private async initializeInfisical() {
    try {
      // Check if Infisical is configured
      const infisicalToken = import.meta.env.VITE_INFISICAL_TOKEN;
      const isDevelopment = import.meta.env.DEV;

      if (!infisicalToken && isDevelopment) {
        console.warn('Infisical not configured - using environment variables');
        return;
      }

      if (!infisicalToken) {
        throw new Error('VITE_INFISICAL_TOKEN is required in production');
      }

      this.infisicalClient = new InfisicalSDK({
        token: infisicalToken,
        siteURL: import.meta.env.VITE_INFISICAL_SITE_URL || 'https://app.infisical.com',
        logLevel: LogLevel.Error,
      });

      console.log('Infisical client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Infisical client:', error);
      // Don't throw - fall back to environment variables
    }
  }

  async getSecrets(): Promise<FrontendSecrets> {
    const now = Date.now();

    // Return cached secrets if still valid
    if (this.cachedSecrets && (now - this.lastFetchTime) < this.cacheExpiry) {
      return this.cachedSecrets;
    }

    // Fallback to environment variables if Infisical not available
    if (!this.infisicalClient) {
      console.warn('Using fallback environment variables');
      return this.getSecretsFromEnv();
    }

    try {
      const environment = import.meta.env.VITE_INFISICAL_ENV || 'production';
      const projectId = import.meta.env.VITE_INFISICAL_PROJECT_ID;

      if (!projectId) {
        throw new Error('VITE_INFISICAL_PROJECT_ID is required');
      }

      // Fetch secrets from Infisical
      const secrets = await this.infisicalClient.listSecrets({
        environment,
        projectId,
        path: '/frontend', // Frontend secrets path within the project
      });

      // Transform Infisical secrets to our format
      const secretsMap = secrets.reduce((acc, secret) => {
        acc[secret.secretKey] = secret.secretValue;
        return acc;
      }, {} as Record<string, string>);

      const frontendSecrets: FrontendSecrets = {
        apiUrl: secretsMap.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
        enableMockApi: secretsMap.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_USE_MOCK_API === 'true',
      };

      // Cache the secrets
      this.cachedSecrets = frontendSecrets;
      this.lastFetchTime = now;

      console.log('Successfully fetched secrets from Infisical');
      return frontendSecrets;

    } catch (error) {
      console.error('Failed to fetch secrets from Infisical:', error);
      
      // Fallback to environment variables on error
      console.warn('Falling back to environment variables');
      return this.getSecretsFromEnv();
    }
  }

  private getSecretsFromEnv(): FrontendSecrets {
    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      enableMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
    };
  }

  // Helper method to get individual secrets
  async getSecret<K extends keyof FrontendSecrets>(key: K): Promise<FrontendSecrets[K]> {
    const secrets = await this.getSecrets();
    return secrets[key];
  }

  // Method to refresh secrets manually
  async refreshSecrets(): Promise<void> {
    this.cachedSecrets = null;
    await this.getSecrets();
  }
}

// Export singleton instance
export const infisicalConfig = InfisicalConfigService.getInstance();
