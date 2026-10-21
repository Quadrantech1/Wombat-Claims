import { config } from '../config/env-config';

export enum Role {
  Admin = 'admin',
  ClaimSpecialist = 'claim_specialist',
  ClaimAdmin = 'claim_admin',
  ClaimAuditor = 'claim_auditor',
  Finance = 'finance'
}

export function getCredentialsForRole(role: Role) {
  switch (role) {
    case Role.Admin:
      return { user: config.USER, password: config.PASSWORD };
    case Role.ClaimSpecialist:
      return { user: config.CLAIM_USER, password: config.CLAIM_PASSWORD };
    case Role.ClaimAuditor:
      return { user: config.CLAIM_AUDIT_USER, password: config.CLAIM_AUDIT_PASSWORD };
    case Role.Finance:
      return { user: config.FINANCE_USER, password: config.FINANCE_PASSWORD };
    case Role.ClaimAdmin:
      return { user: config.CLAIMS_ADMIN_USER, password: config.CLAIMS_ADMIN_PASSWORD };
    default:
      throw new Error(`Unknown role: ${role}`);
  }
}