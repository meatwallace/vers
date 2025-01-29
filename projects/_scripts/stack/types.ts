export enum Command {
  Start = 'start',
  Build = 'build',
  Stop = 'stop',
  Logs = 'logs',
  Status = 'status',
  Exec = 'exec',
}

export enum ServiceID {
  Postgres = 'postgres',
  ServiceAPI = 'service-api',
  ServiceEmail = 'service-email',
  ServiceSession = 'service-session',
  ServiceUser = 'service-user',
  ServiceVerification = 'service-verification',
  ServiceWorld = 'service-world',
}
