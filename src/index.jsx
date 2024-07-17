"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombineProviders = void 0;
exports.CreateFastContext = CreateFastContext;
const react_1 = require("react");
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
function CreateFastContext(initialState) {
    function useStoreData() {
        const store = (0, react_1.useRef)(initialState);
        const get = (0, react_1.useCallback)(() => store.current, []);
        const subscribers = (0, react_1.useRef)(new Set());
        const set = (0, react_1.useCallback)((value) => {
            if (typeof value === 'function') {
                store.current = Object.assign(Object.assign({}, store.current), value(store.current));
            }
            else {
                store.current = Object.assign(Object.assign({}, store.current), value);
            }
            subscribers.current.forEach(callback => callback());
        }, []);
        const subscribe = (0, react_1.useCallback)((callback) => {
            subscribers.current.add(callback);
            return () => subscribers.current.delete(callback);
        }, []);
        return {
            get,
            set,
            subscribe,
        };
    }
    const StoreContext = (0, react_1.createContext)(null);
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
    function Provider({ children }) {
        return <StoreContext.Provider value={useStoreData()}>
      {children}
    </StoreContext.Provider>;
    }
    function useStore(selector = (s) => s) {
        const store = (0, react_1.useContext)(StoreContext);
        if (store == null) {
            throw new Error('StoreContext not found please Wrap your Component with this FastContext by @CheatModes4');
        }
        const state = (0, react_1.useSyncExternalStore)(store.subscribe, () => selector(store.get()), () => selector(initialState));
        return [state, store.set];
    }
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
    function useContextSignals(fieldNames) {
        const fields = fieldNames || Object.keys(initialState);
        const gettersAndSetters = {};
        for (const fieldName of fields) {
            const [getter, setter] = useStore((fc) => fc[fieldName]);
            gettersAndSetters[fieldName] = {
                get: getter,
                set: (value) => setter({ [fieldName]: value })
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
const CombineProviders = (...providers) => {
    return providers.reduce((AccumulatedComponents, CurrentComponent) => {
        return ({ children }) => {
            return (<AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>);
        };
    }, ({ children }) => <>{children}</>);
};
exports.CombineProviders = CombineProviders;
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
