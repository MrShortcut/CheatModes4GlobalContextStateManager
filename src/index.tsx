import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  useRef,
  ComponentType,
  ReactNode
} from 'react';

/**
 * @CheatMode4GlobalContextStateManager extends CreateFastContext_By_Jack_Herrington
 * Completed useContext Global State Manager
 *
 * @Define
 * import { CreateFastContext } from 'CheatModes4'
 *
 * export const initialState = {
 *   cheatMode: '@CheatModes4',
 *   pnls: [] as RecordPnls[],
 *   inputProfit: null as number | null,
 *   isProfit: false,
 *   page: null as null | string,
 *   isOpenModalClear: false,
 * }
 *
 * The important thing it's @example
 *
 * export const {
 *   Provider: PNLProvider,
 *   useStore: usePNLContext,
 *   useContextSignals,
 * } = CreateFastContext(initialState);
 *
 * @use @CRUD @example
 *
 * const [ pnls, set ] = usePNLContext(s => s.pnls)
 * const [ inputProfit ] = usePNLContext(s => s.inputProfit)
 *
 * const handleSubmit = () => inputProfit && set(prev => ({
 *  pnls: [
 *    ...prev.pnls,
 *    {
 *      id: new Date(),
 *      date: new Date(),
 *      trade: {
 *        profit: inputProfit > 0 ? inputProfit : 0,
 *        loss: inputProfit < 0 ? inputProfit : 0,
 *        isProfit: isProfit.get,
 *      },
 *    },
 *  ],
 * }))
 *
 * const handleDelete = (id: Date) => set(prev => ({
 *   pnls: prev.pnls.filter(el => el.id !== id)
 * }))
 *
 * const handleUpdate = (id: Date) => inputProfit && set(prev => ({
 *   pnls: prev.pnls.map(el => el.id === id
 *     ? {
 *       ...el,
 *       trade: {
 *         ...el.trade,
 *         profit: inputProfit > 0 ? inputProfit : 0,
 *         loss: inputProfit < 0 ? inputProfit : 0,
 *         isProfit: isProfit.get,
 *       }
 *     }
 *     : el)
 * }))
 *
 * const addTrade = () => set({ isOpenAddTrade: !isOpenAddTrade.get })
 */
export function CreateFastContext<Store extends {}> (initialState: Store) {
  function useStoreData () {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback(
      (value: Partial<Store> | ((prev: Store) => Partial<Store>)) => {
        if (typeof value === 'function') {
          store.current = { ...store.current, ...value(store.current) };
        } else {
          store.current = { ...store.current, ...value };
        }
        subscribers.current.forEach(callback => callback());
      },
      [],
    );

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);
  /**
   * import { ComponentType, ReactNode } from 'react';
   *
   * type ComponentTypeWithChildren = ComponentType<{ children: ReactNode }>;
   *
   * New method management with context API REACT
   * for better maintainability split Context and providers in
   * isolated files.
   *
   * export const CombineProviders = (
   *   ...providers: ComponentTypeWithChildren[]
   * ): ComponentTypeWithChildren => {
   *   return providers.reduce<ComponentTypeWithChildren>(
   *     (AccumulatedComponents, CurrentComponent) => {
   *       return ({ children }: { children: ReactNode }) => {
   *         return (
   *           <AccumulatedComponents>
   *             <CurrentComponent>{children}</CurrentComponent>
   *           </AccumulatedComponents>
   *         );
   *       };
   *     },
   *     ({ children }) => <>{children}</>
   *   );
   * };
   *
   * import { PNLProvider } from './PnlProvider';
   *
   * export const providers = [
   *   PNLProvider,
   * ]
   *
   * APP Main Context
   * export const AppContextProvider = CombineComponents(...providers)
   * AppContextProvider.displayName = 'AppContextProvider';
   *
   * @use Wrap app or component to fill with data provider
   *   <AppContextProvider>
   *    <App />
   *  </AppContextProvider>
   */
  function Provider ({ children }: { children: React.ReactNode }) {
    return <StoreContext.Provider value={useStoreData()}>
      {children}
    </StoreContext.Provider>
  }

  function useStore<T> (
    selector: (store: Store) => T = (s) => s as unknown as T,
  ): [ T, (value: Partial<Store> | ((prev: Store) => Partial<Store>)) => void ] {
    const store = useContext(StoreContext);

    if (store == null) {
      throw new Error(
        'StoreContext not found please Wrap your Component with this FastContext by @CheatModes4'
      );
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState),
    );

    return [ state, store.set ];
  }

  type InitialStateReturnType = typeof initialState
  type KeyOfInitialState = keyof InitialStateReturnType;
  interface StoreFields extends Record<string, any> { }
  /**
   * const { isOpenModalClear, pnls } = useContextSignals([ 'isOpenModalClear', 'pnls' ]);
   *
   * @methods
   * getter is isOpenModalClear.get
   * setter is isOpenModalClear.set('true')
   *
   * const {
   *  cheatMode,
   *  isProfit,
   *  isOpenAddTrade,
   *  isOpenModalClear,
   * } = useContextSignals()
   */
  function useContextSignals<
    SelectorOutput extends StoreFields[ keyof StoreFields ],
    K extends KeyOfInitialState
  > (
    fieldNames?: K[]
  ): {
      [ key in K ]: {
        get: InitialStateReturnType[ key ],
        set: (value: InitialStateReturnType[ key ]) => void
      }
    } {
    const fields = fieldNames || (Object.keys(initialState) as K[]);

    const gettersAndSetters: {
      [ key in K ]: {
        get: InitialStateReturnType[ key ],
        set: (value: InitialStateReturnType[ key ]) => void
      }
    } = {} as any;

    for (const fieldName of fields) {
      const [ getter, setter ] = useStore(
        (fc: Store) => fc[ fieldName as keyof Store ] as SelectorOutput
      );

      gettersAndSetters[ fieldName ] = {
        get: getter as InitialStateReturnType[ K ],
        set: (value: InitialStateReturnType[ K ]) => setter(
          { [ fieldName ]: value } as unknown as Partial<Store>
        )
      };
    }

    return gettersAndSetters;
  }

  return {
    Provider,
    useStore,
    useContextSignals,
  };
}

/**
 * @example
 */
// export interface Test {
//   id: Date;
//   date: Date;
// }

// export const initialState = {
//   cheatMode: "@CheatModes4",
//   isDarkMode: false,
//   pnls: [] as Test[],
//   inputNumber: null as number | null,
//   page: null as null | string,
// };

/** The important thing it's @example */
// export const {
//   Provider: PNLProvider,
//   useStore: usePNLContext,
//   useContextFields,
// } = CreateFastContext(initialState);

// export const providers = [
//   /**
//    * @example
//    */
//   PNLProvider,
//   ...add moar providers,
// ];

/**
 * New method management with context API REACT
 * for better maintainability split Context and providers in
 * isolated files.
 */
export type ComponentTypeWithChildren = ComponentType<{ children: ReactNode }>;
export const CombineProviders = (
  ...providers: ComponentTypeWithChildren[]
): ComponentTypeWithChildren => {
  return providers.reduce<ComponentTypeWithChildren>(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }: { children: ReactNode }) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};
/**
 * APP Main Context
 */
// export const AppContextProvider = CombineProviders(...providers);

// AppContextProvider.displayName = "AppContextProvider";
/**
 * @Wrap APP With AppContextProvider
 * @Example
 *  <AppContextProvider>
 *     <App />
 *  </AppContextProvider>
 */
