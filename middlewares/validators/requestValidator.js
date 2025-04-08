const { match } = require("path-to-regexp");

const requestValidator = (routeSchemaMapping) => (req, res, next) => {
  const routeKey = `${req.method} ${req.baseUrl}${req.path}`;

  let schema;

  // 在 routeSchemaMapping 中尋找一個與當前請求的完整路徑相匹配的路由
  for (let route in routeSchemaMapping) {
    const matcher = match(route, { decode: decodeURIComponent });
    if (matcher(routeKey)) {
      schema = routeSchemaMapping[route];
      break;
    }
  }

  if (schema) {
    // 取得 schema 定義的 key
    const schemaKeys = Object.keys(schema.describe().keys);

    // 根據 shcemaKets 從 req 中取出相對應的值
    const dataToValidate = schemaKeys.reduce((acc, key) => {
      // 例如 schema 定義了 query、params 或 body 等，就取 req[key]
      acc[key] = req[key];
      return acc;
    }, {});

    const { error } = schema.validate(dataToValidate);

    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message) });
    }
  }

  next();
};

module.exports = requestValidator;
