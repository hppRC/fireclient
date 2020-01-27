const firestoreWhereFilterOp = [
  "<",
  "<=",
  "==",
  ">=",
  ">",
  "array-contains",
  "in",
  "array-contains-any",
];
type ValidateResult = {
  valid: boolean;
  message: string;
};
type ValidateFunction = (obj: any, target: string) => ValidateResult;
type Rule = {
  key: string;
  fn: ValidateFunction;
  optional?: boolean;
}[];

const isNull = (obj: any) => obj === undefined || obj === null;
export const isObject = (obj: any, target: string) => ({
  valid: typeof obj === "object",
  message: `${target} should be object.`,
});
export const isAnyOf = (candidate: any[]) => (obj: any, target: string) => ({
  valid: candidate.indexOf(obj) >= 0,
  message: `${target} should be any of [${candidate}].`,
});
export const isArrayOf = (rule: ValidateFunction) => (obj: any, target: string) => {
  if (!Array.isArray(obj)) {
    return {
      valid: false,
      message: `${target} should be array.`,
    };
  }
  const notMatched = obj
    .map(obj => rule(obj, "Element"))
    .filter((res: ValidateResult) => !res.valid);
  return notMatched.length > 0
    ? {
        valid: false,
        message: `${target} should be array and every element should satisfy below.\n"${notMatched[0].message}"`,
      }
    : {
        valid: true,
        message: "",
      };
};
export const isString = (obj: any, target: string) => ({
  valid: typeof obj === "string",
  message: `${target} should be string.`,
});
export const isNumber = (obj: any, target: string) => ({
  valid: typeof obj === "number",
  message: `${target} should be number.`,
});
export const isBoolean = (obj: any, target: string) => ({
  valid: typeof obj === "boolean",
  message: `${target} should be boolean.`,
});
export const isNotNull = (obj: any, target: string) => ({
  valid: !isNull(obj),
  message: `${target} should not be null or undefined.`,
});
export const isFunction = (obj: any, target: string) => ({
  valid: obj instanceof Function,
  message: `${target} should be function.`,
});
export const condition = (
  condition: (obj: any) => boolean,
  fn1: ValidateFunction,
  fn2: ValidateFunction,
) => (obj: any, target: string) => {
  return condition(obj) ? fn1(obj, target) : fn2(obj, target);
};

export const matches = (rule: Rule) => (obj: any, target: string) => {
  if (typeof obj !== "object") {
    return isObject(obj, target);
  }
  for (let i = 0; i < rule.length; i++) {
    const { fn, key, optional } = rule[i];
    const value = obj[key];
    if (value !== undefined) {
      const matchesRule = fn(value, `"${key}"`);
      console.log("result", target, obj, matchesRule);
      if (!matchesRule.valid) {
        return matchesRule;
      }
      // optional can be undefined
    } else if (!(optional === true)) {
      return {
        valid: false,
        message: `"${key}" should not be null or undefined.`,
      };
    }
  }
  return {
    valid: true,
    message: "",
  };
};
export const matchesArrayOf = (rule: Rule) => (obj: any, target: string) => {
  if (!Array.isArray(obj)) {
    return {
      valid: false,
      message: `${target} should not be null or undefined.`,
    };
  }
  for (let i = 0; i < obj.length; i++) {
    const ele = obj[i];
    const matchesRule = matches(rule)(ele, `Element of ${target}`);
    if (!matchesRule.valid) {
      return matchesRule;
    }
  }
  return {
    valid: true,
    message: "",
  };
};
export const matchesObjectOf = (rule: Rule) => (obj: any, target: string) => {
  if (Array.isArray(obj)) {
    return {
      valid: false,
      message: `${target} should not be array.`,
    };
  }
  if (typeof obj !== "object") {
    return {
      valid: false,
      message: `${target} should not be null or undefined.`,
    };
  }
  const entries = Object.entries(obj);
  for (let i = 0; i < entries.length; i++) {
    const key = entries[i][0];
    const value = entries[i][1];
    const matchesRule = matches(rule)(value, `"${key}"`);
    if (!matchesRule.valid) {
      return matchesRule;
    }
  }
  return {
    valid: true,
    message: "",
  };
};
const whereRule: Rule = [
  {
    key: "field",
    fn: isString,
  },
  {
    key: "operator",
    fn: isAnyOf(firestoreWhereFilterOp),
  },
  {
    key: "value",
    fn: isNotNull,
  },
];
const orderRule: Rule = [
  {
    key: "by",
    fn: isString,
  },
  {
    key: "direction",
    optional: true,
    fn: isAnyOf(["asc", "desc"]),
  },
];
const cursorRule: Rule = [
  {
    key: "origin",
    fn: isNotNull,
  },
  {
    key: "direction",
    fn: isAnyOf(["startAt", "startAfter", "endAt", "endBefore"]),
  },
  {
    key: "multipleFields",
    fn: isBoolean,
  },
];

export const queryOptionRule: Rule = [
  {
    key: "where",
    optional: true,
    fn: condition((obj: any) => !Array.isArray(obj), matches(whereRule), matchesArrayOf(whereRule)),
  },
  {
    key: "limit",
    optional: true,
    fn: isNumber,
  },
  {
    key: "order",
    optional: true,
    fn: condition((obj: any) => !Array.isArray(obj), matches(orderRule), matchesArrayOf(orderRule)),
  },
  {
    key: "cursor",
    optional: true,
    fn: matches(cursorRule),
  },
];
export const queryRule: Rule = [
  {
    key: "location",
    fn: isString,
  },
  {
    key: "connects",
    optional: true,
    fn: isBoolean,
  },
].concat(queryOptionRule as any[]);

export const acceptOutdatedRule: Rule = [
  {
    key: "acceptOutdated",
    fn: isBoolean,
  },
];
export const callbackRule: Rule = [
  {
    key: "callback",
    fn: isFunction,
  },
];
export const mergeRule: Rule = [
  {
    key: "merge",
    optional: true,
    fn: isBoolean,
  },
  {
    key: "mergeFields",
    optional: true,
    fn: isArrayOf(isString),
  },
];
export const arrayQuerySchemaRule: Rule = [
  {
    key: "connects",
    fn: isBoolean,
    optional: true,
  },
  {
    key: "queries",
    fn: matchesArrayOf(queryRule),
  },
].concat(acceptOutdatedRule as any, callbackRule as any);

export const querySchemaRule: Rule = [
  {
    key: "connects",
    fn: isBoolean,
  },
  {
    key: "queries",
    fn: matchesObjectOf(queryRule),
  },
];
export const subCollectionOptionRule = [
  {
    key: "field",
    fn: isString,
  },
  {
    key: "collectionPath",
    fn: isString,
  },
];
export const paginateOptionRule = [
  {
    key: "limit",
    fn: isNumber,
  },
  {
    key: "order",
    fn: condition((obj: any) => !Array.isArray(obj), matches(orderRule), matchesArrayOf(orderRule)),
  },
].concat(queryOptionRule);

export const assert = (isValid: boolean, errorMessage: string) => {
  if (!isValid) throw Error(errorMessage);
};
export const assertObject = (obj: any, target: string) => {
  assert(obj !== undefined, `${target} is undefined.`);
  assert(obj !== null, `${target} is null.`);
  assert(typeof obj === "object", `${target} should be object.`);
};
export const assertArray = (obj: any, target: string) => {
  assert(obj !== undefined, `${target} is undefined.`);
  assert(obj !== null, `${target} is null.`);
  assert(Array.isArray(obj), `${target} should be array.`);
};
export const assertRule = (rule: Rule) => (obj: any, target: string) => {
  const matchesRule = matches(rule)(obj, target);
  assert(matchesRule.valid, matchesRule.message);
};

export const assertSetDocQueryObject = (obj: any, target: string = "SetDocQuery") => {
  assertObject(obj, target);
  assertRule([
    {
      key: "id",
      optional: true,
      fn: isString,
    },
    {
      key: "fields",
      optional: true,
      fn: isObject,
    },
  ])(obj, "Set doc query");
  if (obj.subCollection !== undefined) {
    assertSubCollectionQuery(obj.subCollection, '"subCollection"');
  }
};
export const assertSetDocQuery = (obj: any, target: string = "SetDocQuery") => {
  if (!(obj instanceof Function)) {
    assertSetDocQueryObject(obj, target);
  }
};
const assertSetCollectionQueryOjbect = (obj: any, target: string) => {
  assertArray(obj, target);
  (obj as any[]).forEach(ele => assertSetDocQuery(ele));
};
export const assertSetCollectionQuery = (obj: any, target: string = "SetCollectionQuery") => {
  if (!(obj instanceof Function)) {
    assertSetCollectionQueryOjbect(obj, target);
  }
};

export const assertSubCollectionQuery = (obj: any, target: string = "SubCollectionQuery") => {
  assertObject(obj, target);
  const values = Object.values(obj);
  values.forEach(value => {
    assert(Array.isArray(value), `Value of ${target} should be array.`);
    (value as any[]).forEach((ele: any) => assertSetDocQueryObject(ele, "Element"));
  });
};
export const assertSetDocsQuery = (obj: any, target: string = "SetDocQuery") => {
  assertObject(obj, target);
  const entries = Object.entries(obj);
  entries.forEach(([key, value]) => assertSetDocQuery(value, `"${key}"`));
};
