import { createMutable } from 'solid-js/store';

export interface StoreModel {
  exist: boolean;
  publicPath: string;
}

const createDefaultValue = (): StoreModel => ({
  exist: false,
  publicPath: '',
});

export const store = createMutable<StoreModel>(createDefaultValue());
