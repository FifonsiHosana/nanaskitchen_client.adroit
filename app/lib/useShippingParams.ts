import { useSearchParams } from "react-router";

const DEFAULT_PARAMS = {
  page: "1",
  pageSize: "25",
//   action: "",
  search: "",
};

export function useShippingParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    page: Number(searchParams.get("page") || DEFAULT_PARAMS.page),
    pageSize: Number(searchParams.get("pageSize") || DEFAULT_PARAMS.pageSize),
    // action: searchParams.get("action") ?? DEFAULT_PARAMS.action,
    search: searchParams.get("search") ?? DEFAULT_PARAMS.search,
  };

  const setParam = (key: keyof typeof DEFAULT_PARAMS, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const setParams = (updates: Partial<typeof DEFAULT_PARAMS>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => next.set(k, v));
    if (!("page" in updates)) next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  return { params, setParam, setParams };
}
