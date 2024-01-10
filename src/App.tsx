import type { JsonData, FormStateItem, optionsComputed } from './types';
import { ECharts } from 'echarts-solid';
import { createSignal, For } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { MAP_NAME } from './config/variable.config';

const labelLine = {
  show: true,
  length2: 50,
  showAbove: true,
  lineStyle: {
    color: '#000',
    type: [10, 5],
    join: 'miter',
  },
};

const colors = ['#6f6e6f', '#295f3a', '#557a31', '#8fa349', '#b8ae29', '#e59d3d', '#e5663d', '#b53737', '#6a0a0d', '#410508'];
const defaultFromStateItem = (i = 0) => ({
  color: colors[i],
});
const generatePieces = (formState: FormStateItem[]) => {
  return formState.map((item) => {
    const obj: { [key: string]: number | string } = { color: item.color };
    if (item.min) {
      obj.min = +item.min;
    }

    if (item.max) {
      obj.max = +item.max;
    }

    return obj;
  });
};

export default function App() {
  const [jsonContent, setJsonContent] = createSignal<Array<JsonData>>([]);
  const [formState, setFormState] = createSignal<Array<FormStateItem>>([defaultFromStateItem()]);
  const [alerts, setAlerts] = createSignal<string>('');

  const options: optionsComputed = () => {
    return {
      visualMap: {
        show: false,
        type: 'piecewise',
        pieces: generatePieces(formState()),
      },
      series: {
        type: 'map',
        map: MAP_NAME,
        zoom: 1.24,
        silent: true,
        label: {
          show: true,
          color: '#fff',
          formatter: (item) => {
            return item.value ? `{a|${item.name}}\n{b|${item.value}}` : '';
          },
          rich: {
            a: {
              fontSize: 14,
              fontFamily: 'Medium',
              lineHeight: 18,
            },
            b: {
              fontSize: 18,
              fontFamily: 'Heavy',
              lineHeight: 21,
            },
          },
        },
        emphasis: {
          disabled: true,
        },
        data: jsonContent(),
        labelLayout: (item) => {
          if (item.text.includes('北京')) {
            return {
              x: 360,
              y: 220,
            };
          }

          if (item.text.includes('天津')) {
            return {
              x: 590,
              y: 314,
            };
          }

          if (item.text.includes('广东')) {
            return {
              y: 536,
            };
          }

          if (item.text.includes('香港')) {
            return {
              x: 494,
              y: 566,
            };
          }

          if (item.text.includes('澳门')) {
            return {
              x: 460,
              y: 580,
            };
          }

          if (item.text.includes('新疆')) {
            return {
              x: 160,
              y: 280,
            };
          }

          if (item.text.includes('西藏')) {
            return {
              x: 180,
              y: 420,
            };
          }

          return item;
        },
      },
    };
  };

  // 文件读取
  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      // 读取 json
      reader.readAsText(file, 'UTF-8');
      // 更新状态
      reader.onload = (e: any) => {
        try {
          const data = e.target?.result;
          const content = JSON.parse(data) as Array<JsonData>;

          if (!Array.isArray(content)) {
            setAlerts('请检查文件内容');
            return;
          }

          setJsonContent(
            content.map((item) => {
              const name = item.name.replace(/(省|市|维吾尔自治区|壮族自治区|自治区|回族自治区|特别行政区)/g, '');
              if (['北京', '天津'].includes(name)) {
                return {
                  ...item,
                  name,
                  labelLine,
                };
              }
              return {
                ...item,
                name,
              };
            }),
          );
        } catch (error) {
          setAlerts(String(error));
        }
      };
    }
  };

  // 表单事件
  const handleChange = <K extends keyof FormStateItem>(key: K, value: string, index: number) => {
    setFormState((prev) => {
      const updatedState = [...prev];
      updatedState[index][key] = value;
      return updatedState;
    });
  };

  return (
    <div class='flex w-screen items-center justify-center gap-x-4 p-4'>
      <Transition
        onEnter={(el, done) => {
          const a = el.animate(
            [
              { opacity: 0, top: 0, transform: 'scale(0.8)' },
              { opacity: 1, top: '2rem', transform: 'scale(1)' },
            ],
            {
              duration: 300,
            },
          );
          a.finished.then(done);
          setTimeout(() => {
            setAlerts('');
          }, 3000);
        }}
        onExit={(el, done) => {
          const a = el.animate(
            [
              { opacity: 1, top: '2rem', transform: 'scale(1)' },
              { opacity: 0, top: 0, transform: 'scale(0.8)' },
            ],
            {
              duration: 300,
            },
          );
          a.finished.then(done);
        }}
      >
        {!!alerts() && (
          <div
            class='left-[cale(50% - 24rem)] fixed top-8 z-50 min-w-96 rounded-lg border border-red-200 bg-red-100 p-4 text-center text-sm text-red-800 dark:border-red-900 dark:bg-red-800/10 dark:text-red-500'
            role='alert'
          >
            <span class='font-bold'>Error</span> {alerts()}
          </div>
        )}
      </Transition>
      <div class='rounded-xl border bg-gray-300 p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800'>
        <ECharts width={700} height={700} option={options()} />
      </div>
      <div class='box-content h-[700px] w-[700px] rounded-xl border p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800'>
        <input
          type='file'
          accept='.json'
          name='file-input'
          id='file-input'
          onChange={handleFileChange}
          class='mb-3 block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-100 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50
    dark:border-gray-700 dark:bg-slate-900
    dark:text-gray-400 dark:file:bg-gray-700
    dark:file:text-gray-400 dark:focus:outline-none
    dark:focus:ring-1 dark:focus:ring-gray-600'
        />
        <For each={formState()}>
          {(each, index) => (
            <div class='mb-3 mt-3 flex h-12 gap-3'>
              <input
                type='text'
                class='block h-full flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600'
                placeholder='请填写区间范围 min'
                value={each.min || ''}
                onBlur={(e) => handleChange('min', e.target.value, index())}
              />
              <input
                type='text'
                class='block h-full flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600'
                placeholder='请填写区间范围 max'
                value={each.max || ''}
                onBlur={(e) => handleChange('max', e.target.value, index())}
              />
              <input
                type='color'
                class='block h-full w-1/6 flex-shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900'
                value={each.color}
                onBlur={(e) => handleChange('color', e.target.value, index())}
              />
              <button
                type='button'
                class='inline-flex  items-center justify-end gap-x-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
                disabled={formState().length < 2}
                onClick={() => setFormState((prev) => prev.filter((_, i) => index() !== i))}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  class='lucide lucide-minus-square'
                >
                  <rect width='18' height='18' x='3' y='3' rx='2' />
                  <path d='M8 12h8' />
                </svg>
              </button>
            </div>
          )}
        </For>
        {formState().length < 10 && (
          <button
            type='button'
            class='inline-flex w-full select-none items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-100 px-4 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
            onClick={() => setFormState((prev) => prev.concat(defaultFromStateItem(prev.length)))}
          >
            Add From
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              class='lucide lucide-plus-square'
            >
              <rect width='18' height='18' x='3' y='3' rx='2' />
              <path d='M8 12h8' />
              <path d='M12 8v8' />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
