import { type components, type operations } from '../../yhdisteri/lib/types';

// Request params type helper
export type PathParams<T extends string> = T extends `${infer Start}/{${infer Param}}${infer Rest}`
  ? { [K in Param]: string } & PathParams<Rest>
  : {};

// Component schema types
export type Organization = components['schemas']['Organization'];
export type Member = components['schemas']['Member'];

// Operation response types
export type HealthCheckResponse = operations['getHealth']['responses']['200']['content']['application/json'];
export type GetUserResponse = operations['getUserById']['responses']['200']['content']['application/json'];
export type GetCurrentUserResponse = operations['getCurrentUser']['responses']['200']['content']['application/json'];
export type GetOrganizationsResponse = operations['getUserOrganizations']['responses']['200']['content']['application/json'];
export type GetOrganizationMembersResponse = operations['getOrganizationMembers']['responses']['200']['content']['application/json'];
export type CreateUserRequest = operations['createUser']['requestBody']['content']['application/json'];
export type CreateUserResponse = operations['createUser']['responses']['200']['content']['application/json'];

// Request param types
export type GetUserParams = PathParams<'/users/{id}'>;
export type GetOrganizationMembersParams = PathParams<'/organizations/{id}/members'>;