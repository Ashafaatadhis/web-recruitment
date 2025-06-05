function convertPathToRegex(path: string): RegExp {
  const uuidRegex =
    "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
  const pattern = path.replace(/:id/g, uuidRegex);
  return new RegExp(`^${pattern}$`);
}
export default convertPathToRegex;
