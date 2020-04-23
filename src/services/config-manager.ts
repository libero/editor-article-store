import { Config } from '../types/config';
import { ConfigManager } from '../types/config-manager';

// Encapsulates a Configuration
class ConfigManagerInstance implements ConfigManager {
  private config: Map<string, string>;
  constructor() {
    this.config = new Map();
  }

  // Get the value of the specified key from this config object.
  get(key: string): string {
    if (!this.config.has(key)) {
      throw new Error(`Configuration entry '${key} not found!`);
    }
    return this.config.get(key) as string;
  }

  // Set the value of the specified key in this config object.
  set(key: string, value: string, overwrite: boolean = false): void {
    if (this.config.has(key) && !overwrite) {
      throw new Error(`Configuration entry '${key} already exists!`);
    }
    this.config.set(key, value);
  }

  // Merge the supplied configaration with this one, overwriting duplicate keys with the new values.
  apply(config: Config): void {
    for (const [key, value] of Object.entries(config)) {
      this.config.set(key, value as string);
    }
  }

  // istanbul ignore next
  // Dumps the config to the console, used for debugging purposes.
  dump(): void {
    console.log(`Config`);
    for (const [key, value] of this.config.entries()) {
      console.log(`  ${key} = ${value}`);
    }
  }
}

export const configManager = new ConfigManagerInstance();
