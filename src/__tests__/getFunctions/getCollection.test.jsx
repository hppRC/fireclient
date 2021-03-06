import { renderHook } from "@testing-library/react-hooks";
import { List } from "immutable";
import { useState, useEffect } from "react";
import { getCollection } from "../../../dist/getFunctions";
import { useSetContext } from "../../../dist/provider";
import backup from "../backup1.json";
import { app, db } from "../firestore";

const useTest = ({ path, onGet, options }) => {
  useSetContext(db);
  const [finished, setFinished] = useState(false);
  const onError = err => {
    throw new Error(err);
  };
  useEffect(
    () =>
      getCollection(
        path,
        doc => {
          onGet(doc);
          setFinished(true);
        },
        err => {
          onError(err);
          setFinished(true);
        },
        options,
        false,
        false,
      ),
    [],
  );
  return finished;
};

const cities = [
  {
    data: backup.cities.MexicoCity,
    id: "MexicoCity",
  },
  {
    data: backup.cities.Mumbai,
    id: "Mumbai",
  },
  {
    data: backup.cities.NewYork,
    id: "NewYork",
  },
  {
    data: backup.cities.SaoPaulo,
    id: "SaoPaulo",
  },
  {
    data: backup.cities.Tokyo,
    id: "Tokyo",
  },
];

describe("Get Collection", () => {
  afterAll(async () => await app.delete());
  it("should handle a simple query", async () => {
    const expected = List(cities)
      .sortBy(city => city.data.name)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: {
        by: "name",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "where" option', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.name)
      .filter(city => city.data.population >= 19354922)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      where: {
        field: "population",
        operator: ">=",
        value: 19354922,
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "where" option', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.name)
      .filter(city => city.data.population >= 19354922 && city.data.population < 20000000)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      where: [
        {
          field: "population",
          operator: "<",
          value: 20000000,
        },
        {
          field: "population",
          operator: ">=",
          value: 19354922,
        },
      ],
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "limit" option', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.name)
      .slice(0, 3)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      limit: 3,
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "order" option (no direction)', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.population)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: {
        by: "population",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "order" option (asc)', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.population)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: {
        by: "population",
        direction: "asc",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle "order" option (desc)', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.population)
      .reverse()
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: {
        by: "population",
        direction: "desc",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "order" option', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.foo)
      .sortBy(city => city.data.population)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: [
        {
          by: "population",
        },
        {
          by: "foo",
        },
      ],
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "cursor" option (startAt)', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.population)
      .filter(city => city.data.population >= 19028000)
      .slice(0, 2)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: {
        by: "population",
      },
      limit: 2,
      cursor: {
        origin: 19028000,
        direction: "startAt",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "cursor" option (startAfter)', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.population)
      .filter(city => city.data.population > 19028000)
      .slice(0, 2)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: {
        by: "population",
      },
      limit: 2,
      cursor: {
        origin: 19028000,
        direction: "startAfter",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });

  it('should handle multiple "cursor" option (multiple fields)', async () => {
    const expected = List(cities)
      .sortBy(city => city.data.foo)
      .sortBy(city => city.data.population)
      .filter(
        city =>
          city.data.population > 18845000 ||
          (city.data.population === 18845000 && city.data.foo >= 2),
      )
      .slice(0, 2)
      .toJS();
    const onGet = collectionData => expect(collectionData).toEqual(expected);
    const options = {
      order: [
        {
          by: "population",
        },
        {
          by: "foo",
        },
      ],
      limit: 2,
      cursor: {
        multipleFields: true,
        origin: [18845000, 2],
        direction: "startAt",
      },
    };
    const { waitForNextUpdate } = renderHook(() => useTest({ path: "/cities", onGet, options }));
    await waitForNextUpdate();
  });
});
