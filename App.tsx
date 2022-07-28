import axios, { AxiosInstance } from 'axios';
import * as React from 'react';
import './style.css';
const fallback = <div style={{ backgroundColor: 'red' }}>loading</div>;

export default function App() {
  const [data, isLoading] = useData();

  return (
    <div>
      <AsyncWrapper isLoading={isLoading} fallback={fallback}>
        <Child data={data} />
      </AsyncWrapper>
    </div>
  );
}

function Child({ data }) {
  return <div>{data}</div>;
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

function AsyncWrapper({
  children,
  fallback,
  isLoading,
}: React.PropsWithChildren<{ fallback: any; isLoading: boolean }>) {
  return isLoading ? fallback : children;
}

function useAxios(): [AxiosInstance, boolean] {
  const [isLoading, setLoading] = React.useState(false);

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
