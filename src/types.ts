import type { EChartsOption } from 'echarts';

export type JsonData = {
  name: string;
  value: number;
  labelLine?: any;
  label?: any;
};

export type FormStateItem = {
  min?: string;
  max?: string;
  color: string;
};

export type optionsComputed = () => EChartsOption;
