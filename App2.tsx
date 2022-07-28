import axios, { AxiosInstance } from 'axios';
import * as React from 'react';
import './style.css';
const fallback = <div style={{ backgroundColor: 'red' }}>loading</div>;

export default function App() {
  return (
    <div>
      <AsyncProvider fallback={fallback}>
        <Child />
      </AsyncProvider>
      <AsyncProvider fallback={fallback}>
        <Child />
      </AsyncProvider>
    </div>
  );
}

function Child() {
  const [data, isLoading] = useData();
  return !isLoading && <div>{data}</div>;
}

function GrandChild() {
  const [data, isLoading] = useData();
  return !isLoading && <div>{data}</div>;
}

function useData(): [any, boolean] {
  const [data, setData] = React.useState<any>();
  const [axiosInstance, isLoading] = useAxios();
  const fetch = async () => {
    axiosInstance
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => {
        setData(response.data.title);
      });
  };

  React.useEffect(() => {
    fetch();
  }, []);

  return [data, isLoading];
}

const LoadContext = React.createContext<boolean | null>(null);
const SetLoadContext = React.createContext<React.Dispatch<
  React.SetStateAction<boolean>
> | null>(null);

function AsyncProvider({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback: any }>) {
  const [isLoading, setLoading] = React.useState(false);

  return (
    <LoadContext.Provider value={isLoading}>
      <SetLoadContext.Provider value={setLoading}>
        {isLoading && fallback}
        {children}
      </SetLoadContext.Provider>
    </LoadContext.Provider>
  );
}

function useAxios(): [AxiosInstance, boolean] {
  const isLoading = React.useContext(LoadContext);
  const setLoading = React.useContext(SetLoadContext);

  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use((request) => {
    setLoading(true);
    return request;
  });

  axiosInstance.interceptors.response.use((response) => {
    setLoading(false);
    return response;
  });

  return [axiosInstance, isLoading];
}
