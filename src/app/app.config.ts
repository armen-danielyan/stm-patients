import { InjectionToken } from '@angular/core';

export interface IAppConfig {
  mask: {
    date: Array<string | RegExp>;
  };
}

export const APP_CONFIG_TOKEN = new InjectionToken<IAppConfig>('APP_CONFIG_TOKEN');


export const APP_CONFIG: IAppConfig = {
  mask: {
    date: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]
  }
};
