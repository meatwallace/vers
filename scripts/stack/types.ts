export enum Command {
  Build = 'build',
  Exec = 'exec',
  Logs = 'logs',
  Start = 'start',
  Status = 'status',
  Stop = 'stop',
}

export enum ServiceID {
  Postgres = 'postgres',
  ServiceAPI = 'service-api',
  ServiceEmail = 'service-email',
  ServiceSession = 'service-session',
  ServiceUser = 'service-user',
  ServiceVerification = 'service-verification',
}
