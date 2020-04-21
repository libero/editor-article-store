import { Config } from './config';

export interface ConfigManager {
  get(key: string): string;
  set(key: string, value: string, overwrite?: boolean): void;
  apply(config: Config): void;
  apply(config: Config): void;
}
