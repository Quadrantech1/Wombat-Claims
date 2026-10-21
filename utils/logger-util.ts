import winston from 'winston';

const customLevels = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3
  },
  colors: {
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    debug: 'grey'
  }
};

winston.addColors(customLevels.colors);

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/tests.log',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

export function formatHttpLog({
  type,
  method,
  url,
  headers,
  body,
  status,
  source
}: {
  type: 'REQUEST' | 'RESPONSE',
  method?: string,
  url: string,
  headers: Record<string, any>,
  body?: any,
  status?: number,
  source?: string
}) {
  let log = '';
  if (source) {
    log += `[${source}]\n`;
  }
  if (type === 'REQUEST') {
    log += `> ${method}\n`;
    log += `> ${url}\n`;
    Object.entries(headers).forEach(([k, v]) => log += `> ${k}: ${v}\n`);
    if (body) {
      log += formatBody(body) + '\n';
    }
  } else {
    log += `< Response: Status: ${status}\n`;
    Object.entries(headers).forEach(([k, v]) => log += `< ${k}: ${v}\n`);
    if (body) {
      log += formatBody(body) + '\n';
    }
  }
  return log;
}

function formatBody(body: any): string {
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return body;
    }
  }
  return JSON.stringify(body, null, 2);
}
