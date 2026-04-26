export const process = async (params: unknown) => {
  const { makeProcess } = await import("../_codegen/logic");
  return makeProcess("rust")(params);
};
