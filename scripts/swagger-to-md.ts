/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

const INIT_URL = 'https://api.eventhub.rahulshettyacademy.com/api/docs/swagger-ui-init.js';
const OUT_PATH = path.resolve(__dirname, '../docs/api-reference.md');

function fetchInitJs(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(INIT_URL, { headers: { Authorization: `Bearer ${token}` } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function extractSwaggerDoc(initJs: string): Record<string, unknown> {
  const marker = '"swaggerDoc": ';
  const start = initJs.indexOf(marker) + marker.length;
  let depth = 0, i = start, inStr = false, escape = false;
  for (; i < initJs.length; i++) {
    const ch = initJs[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inStr) { escape = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (!inStr) {
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
    }
  }
  return JSON.parse(initJs.slice(start, i));
}

type SchemaObject = {
  type?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  $ref?: string;
  example?: unknown;
};

type ParameterObject = {
  name: string;
  in: string;
  required?: boolean;
  schema?: SchemaObject;
  description?: string;
};

type OperationObject = {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: ParameterObject[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: SchemaObject }>;
  };
  responses?: Record<string, { description?: string; content?: Record<string, { schema?: SchemaObject }> }>;
  security?: unknown[];
};

type PathItemObject = Record<string, OperationObject>;

function schemaToString(schema: SchemaObject | undefined, components: Record<string, unknown>, indent = ''): string {
  if (!schema) return 'N/A';
  if (schema.$ref) {
    const name = schema.$ref.split('/').pop()!;
    const resolved = (components as Record<string, Record<string, SchemaObject>>)?.schemas?.[name];
    if (resolved?.properties) {
      return Object.entries(resolved.properties)
        .map(([k, v]) => `${indent}- \`${k}\` (${v.type ?? 'object'})`)
        .join('\n');
    }
    return `${indent}${name}`;
  }
  if (schema.properties) {
    return Object.entries(schema.properties)
      .map(([k, v]) => `${indent}- \`${k}\` (${v.type ?? 'object'})`)
      .join('\n');
  }
  return `${indent}${schema.type ?? 'object'}`;
}

function buildMarkdown(spec: Record<string, unknown>): string {
  const paths = (spec.paths ?? {}) as Record<string, PathItemObject>;
  const components = (spec.components ?? {}) as Record<string, unknown>;
  const info = spec.info as { title?: string; version?: string; description?: string } | undefined;

  const lines: string[] = [
    `# ${info?.title ?? 'API Reference'}`,
    ``,
    `> Version: ${info?.version ?? 'unknown'}`,
    ``,
    info?.description ? `${info.description}\n` : '',
    `---`,
    ``,
  ];

  const methods = ['get', 'post', 'put', 'patch', 'delete'];

  for (const [pathKey, pathItem] of Object.entries(paths)) {
    for (const method of methods) {
      const op = pathItem[method] as OperationObject | undefined;
      if (!op) continue;

      const authRequired = Array.isArray(op.security) && op.security.length > 0 ? 'Yes' : 'No';

      lines.push(`## ${method.toUpperCase()} ${pathKey}`);
      lines.push(`**Summary:** ${op.summary ?? 'N/A'}`);
      lines.push(`**Auth required:** ${authRequired}`);
      lines.push('');

      // Parameters
      if (op.parameters && op.parameters.length > 0) {
        lines.push('**Parameters:**');
        for (const p of op.parameters) {
          const req = p.required ? ' *(required)*' : '';
          lines.push(`- \`${p.name}\` (${p.in})${req}${p.description ? ' — ' + p.description : ''}`);
        }
      } else {
        lines.push('**Parameters:** None');
      }
      lines.push('');

      // Request body
      if (op.requestBody?.content) {
        const contentEntry = Object.values(op.requestBody.content)[0];
        const bodySchema = schemaToString(contentEntry?.schema, components);
        lines.push('**Request body:**');
        lines.push(bodySchema);
      } else {
        lines.push('**Request body:** None');
      }
      lines.push('');

      // Response
      const successCode = Object.keys(op.responses ?? {}).find((c) => c.startsWith('2')) ?? '';
      const successResp = successCode ? op.responses![successCode] : undefined;
      if (successResp?.content) {
        const respEntry = Object.values(successResp.content)[0];
        const respSchema = schemaToString(respEntry?.schema, components);
        lines.push('**Response:**');
        lines.push(respSchema);
      } else if (successResp?.description) {
        lines.push(`**Response:** ${successResp.description}`);
      } else {
        lines.push('**Response:** N/A');
      }
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}

async function main() {
  const token = process.env.API_TOKEN;
  if (!token) {
    console.error('API_TOKEN not set in environment');
    process.exit(1);
  }

  const initJs = await fetchInitJs(token);
  const spec = extractSwaggerDoc(initJs);
  const markdown = buildMarkdown(spec);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, markdown);

  const endpointCount = Object.values(spec.paths as object).reduce(
    (sum, item) => sum + ['get', 'post', 'put', 'patch', 'delete'].filter((m) => m in item).length,
    0
  );
  console.log(`✅ docs/api-reference.md generated — ${endpointCount} endpoints documented`);
}

main().catch((e) => { console.error(e); process.exit(1); });
