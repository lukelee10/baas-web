/**
 * App Global Variables & Constants
 */
export const AppGlobalConstants = {
  TimeOutErrorCode: 401,
  ApplicationError: 422,
  ClientPingInterval: 15,
  MaxAllowedIdleTimeInSeconds: 1200,
  TimeOutInSeconds: 600
};

export const enum UserRoles {
  FSPUser = 'FSP-User',
  Lead = 'Lead',
  Admin = 'Admin',
  NonFSPUser = 'Non-FSP-User'
}
