const useFetch = (actionPath, method = 'GET', body = null, headers = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!actionPath) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const baseURL = import.meta.env.VITE_BACKEND_SERVER;
      const cleanBaseURL = baseURL.replace(/\/$/, '');
      const cleanActionPath = actionPath.startsWith('/') ? actionPath : `/${actionPath}`;
      const url = actionPath.startsWith('http')
        ? actionPath
        : `${cleanBaseURL}${cleanActionPath}`;

      const response = await axios({
        method,
        url,
        data: body,
        headers,
      });

      setData(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  }, [actionPath, method]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
