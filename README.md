# CheatModes4 Global Context State Manager

This library is based on a hook that Jack Herrington has published on his YouTube channel

[Making React Context FAST!](https://www.youtube.com/watch?v=ZKlXqrcBx88)
[Github Repository](https://github.com/jherr/fast-react-context)

That is the starting point, which I have been extending its functionality to take advantage of all the power of React, the idea is to **simplify the code to eliminate the Drilling prop and the complexity and code base of some libraries to handle global states, it also solves React Context and useState Hell.**

![Context Hell](https://github.com/MrShortcut/CheatModes4GlobalContextStateManager/raw/main/src/assets/contexthell.jpg)
![useState Hell](https://github.com/MrShortcut/CheatModes4GlobalContextStateManager/raw/main/src/assets/useStatehell.png)

# To install it
To install the library, use the following command:

```ts
npm i cheatmodes4
```

### Use

Import and Configure
First, import the necessary functions from cheatmodes4:

```ts
import { CombineProviders, CreateFastContext } from 'cheatmodes4';
```

### Define the Initial State
Define the initial state of your application. You can use interfaces or types depending on your needs.

> example

```ts
const initialState = {
  foo: 'bar',
  CheatMode: 'CheatModes4',
  count: 0,
  array: null as number[] | null,
  // otros campos que necesites
};
```

### Create the Global Context
Use CreateFastContext to define the global context and destructure the providers, getters, and setters.

```ts
export const {
  Provider: InitialStateProvider,
  useContextSignals,
  useStore,
} = CreateFastContext(initialState);
```

### Combine Providers
If you have multiple contexts, combine them using CombineProviders.

```ts
const providers = [
  InitialStateProvider
];

export const CheatModes4GlobalContextStateManager = CombineProviders(...providers);
CheatModes4GlobalContextStateManager.displayName = 'AppGlobalContextProvider';

```

### Provide Context to the Application
Finally, pass the provider to your application or component that needs to consume the context information.

```tsx
  <CheatModes4GlobalContextStateManager>
    <App />
    <Component />
  </CheatModes4GlobalContextStateManager>
```

# Complete usage example
Now to use the context information we have several ways to use it
This is a code base created with the Vite.ts packager but I have cleaned it and left the ways to read and set the context state properties.

```tsx
import { useContextSignals, useStore } from './mainContext'

export default function App () {
  const [ foo, set ] = useStore(s /* store */ => s.foo)
  const { CheatMode } = useContextSignals()

  return <>
    <a
      onClick={() => CheatMode.set('s4')}
    >
      <img src={viteLogo} className='logo' />
    </a>

    <a
      onClick={() => set({ foo: 'hello' })}
    >
      <img src={reactLogo} className='logo react' />
    </a>

    <h1>CheatMode<i>{CheatMode.get}</i></h1>

    <h2>foo: {foo}</h2>

    <div className='card'>
      <Counter />

      <button onClick={() => set(s => ({ count: s.count - 1 }))} >Decrese</button>
    </div>
  </>
}

export function Counter () {
  const { count } = useContextSignals()
  // const [ count, set ] = useContextFields(s => s.count) // another example

  return <>
    <button onClick={() => count.set(count.get + 1)} >
      Increase
    </button>

    <p>count is {count.get}</p>
  </>
}
```

> Has all the power of typescript to detect properties and infer types
![typescript inference](https://github.com/MrShortcut/CheatModes4GlobalContextStateManager/raw/main/src/assets/inference.png)
![autocomplete](https://github.com/MrShortcut/CheatModes4GlobalContextStateManager/raw/main/src/assets/autocomplete.png)
![auto](https://github.com/MrShortcut/CheatModes4GlobalContextStateManager/raw/main/src/assets/auto.png)

> Also the useState callback to update the state according to its previous properties
![types](https://github.com/MrShortcut/CheatModes4GlobalContextStateManager/raw/main/src/assets/cb.png)

#### Now you're ready to make beautiful React code free of common bad practices.
If this project has served you and liked it, and if you want to support financially to continue developing it, contact me
rmoreno4sier@gmail.com

