import dotenv from 'dotenv';
import path from 'path';

class Config {
    private static instance: Config;
    private readonly nodeEnv: string;
    private readonly vmNumber: string;
    private readonly greenBlue: string;

    // ======= URL CONFIGURATIONS =======
    readonly URL_AKC: string;
    readonly URL_PPI: string;
    readonly URL_FELIX: string;
    readonly URL_ORCA: string;
    readonly URL_ORCA_GROUP: string;
    readonly URL_AKC_NEW: string;
    readonly URL_PPI_NEW: string;
    readonly URL_PPU: string;
    readonly URL_ASPCA: string;
    readonly URL_OPP: string;
    readonly URL_ORCA_CA: string;
    readonly URL_WOMBAT: string;
    readonly URL_EARNIX: string;

    // ======= ADMIN USER CREDENTIALS =======
    readonly USER: string;
    readonly PASSWORD: string;

    // ======= TEST CONFIGURATIONS =======
    readonly API_HOST: string;
    readonly GATEWAY_URL: string;
    readonly IS_ENABLED_ORCA_MFA: boolean;
    readonly ENVIRONMENT: string;
    readonly SLOWMO: number;

    // ======= DATABASE CONFIGURATIONS =======
    readonly SQL_SERVER: string;
    readonly SQL_USER: string;
    readonly SQL_PASSWORD: string;
    readonly SQL_DB: string;

    // ======= EMAIL CONFIGURATIONS =======
    readonly EMAIL_DOMAIN: string;
    readonly EMAIL_SERVER_ID: string;
    readonly EMAIL_APIKEY: string;

    // ======= PAYMENT CONFIGURATIONS =======
    readonly TRUST_COMMERCE: string;
    readonly API_STRIPE: string;
    readonly STRIPE_RETURN_URL: string;
    readonly SECRET_KEY: string;
    readonly CREDIT_CARD: string;
    readonly SIDNEY_STRIPE_SECRET_KEY: string;
    readonly SIDNEY_URL: string;

    // ======= OTHER USER CREDENTIALS =======
    readonly CLAIM_USER: string;
    readonly CLAIM_PASSWORD: string;
    readonly CLAIM_AUDIT_USER: string;
    readonly CLAIM_AUDIT_PASSWORD: string;
    readonly SALES_USER: string;
    readonly SALES_PASSWORD: string;
    readonly RETENTION_AGENT_USER: string;
    readonly RETENTION_AGENT_PASSWORD: string;
    readonly CUSTOMER_USER: string;
    readonly CUSTOMER_PASSWORD: string;
    readonly FINANCE_USER: string;
    readonly FINANCE_PASSWORD: string;
    readonly CLAIMS_ADMIN_USER: string;
    readonly CLAIMS_ADMIN_PASSWORD: string;

    // ================= WOMBAT ==================

    readonly WOMBAT_ADMIN_USER: string;
    readonly WOMBAT_ADMIN_PASSWORD: string;


    private constructor() {
        // Load environment variables
        const env = process.env.NODE_ENV || 'qas';
        this.nodeEnv = env.toLowerCase();
        const commonFilePath = path.resolve(process.cwd(), 'config', `.env.common`);
        const envFilePath = path.resolve(process.cwd(), 'config', `.env.${env}`);
        const secretFilePath = path.resolve(process.cwd(), 'config', `.env.keys`);

        // Load common first then environment-specific and secret keys
        const common = dotenv.config({ path: commonFilePath, override: true });
        const result = dotenv.config({ path: envFilePath, override: true });
        const keys = dotenv.config({ path: secretFilePath, override: true });

        // env-specific and keys and common are required;
        if (result.error || keys.error || common.error) {
            throw new Error(`Environment configuration failed: ${result.error?.message || keys.error?.message || common.error?.message}`);
        }
        // Get VM number from environment file
        this.vmNumber = process.env.VM_NUMBER || '';

        // Initialize URL configurations with VM number replacement
        this.greenBlue = process.env.GREEN_BLUE || '';

        this.URL_AKC = this.resolveUrl(process.env.urlAKC || '');
        this.URL_PPI = this.resolveUrl(process.env.urlPPI || '');
        this.URL_FELIX = this.resolveUrl(process.env.urlFelix || '');
        this.URL_ORCA = this.resolveUrl(process.env.urlOrca || '');
        this.URL_ORCA_GROUP = this.resolveUrl(process.env.urlOrcaGroup || '');
        this.URL_AKC_NEW = this.resolveUrl(process.env.urlAkcNew || '');
        this.URL_PPI_NEW = this.resolveUrl(process.env.urlPpiNew || '');
        this.URL_PPU = this.resolveUrl(process.env.urlPPU || '');
        this.URL_OPP = this.resolveUrl(process.env.urlOPP || '');
        this.URL_ASPCA = this.resolveUrl(process.env.urlASPCA || '');
        this.URL_ORCA_CA = this.resolveUrl(process.env.urlOrcaCa || '');
        this.URL_WOMBAT = this.resolveUrl(process.env.urlWombat || '');
        this.URL_EARNIX = this.resolveUrl(process.env.urlEarnix || '');
        // Replace VM placeholders in API hosts
        this.API_HOST = this.resolveUrl(process.env.apiHost || '');
        this.GATEWAY_URL = this.resolveUrl(process.env.gatewayUrl || '');
        this.STRIPE_RETURN_URL = this.resolveUrl(process.env.stripeReturnUrl || '');

        // Initialize admin credentials
        this.USER = process.env.user || '';
        this.PASSWORD = process.env.password || '';

        // Initialize test configurations
        this.IS_ENABLED_ORCA_MFA = process.env.isEnabledOrcaMFA === 'true' ? true : false;
        this.ENVIRONMENT = process.env.environment || '';
        this.SLOWMO = process.env.slowMo ? parseInt(process.env.slowMo) : 0;

        // Initialize database configurations
        // Use VM_NUMBER with first character removed for SQL server hostnames (single-line)
        this.SQL_SERVER = this.resolveUrl(process.env.sqlServer || '', { useSqlVm: true });
        this.SQL_USER = process.env.sqlUser || '';
        this.SQL_PASSWORD = process.env.sqlPassword || '';
        this.SQL_DB = process.env.sqlDB || '';

        // Initialize email configurations
        this.EMAIL_DOMAIN = process.env.emailDomain || '';
        this.EMAIL_SERVER_ID = process.env.emailServerId || '';
        this.EMAIL_APIKEY = process.env.emailApikey || '';

        // Initialize payment configurations
        this.TRUST_COMMERCE = process.env.trustCommerce || '';
        this.API_STRIPE = process.env.apiStripe || '';
        this.SECRET_KEY = process.env.stripeSecretKey || '';
        this.CREDIT_CARD = process.env.creditCard || '';
        this.SIDNEY_STRIPE_SECRET_KEY = process.env.sidneyStripeSecretKey || '';
        this.SIDNEY_URL = process.env.sidneyUrl || '';

        // Initialize other user credentials
        this.CLAIM_USER = process.env.claimUser || '';
        this.CLAIM_PASSWORD = process.env.claimPassword || '';
        this.CLAIM_AUDIT_USER = process.env.claimAuditUser || '';
        this.CLAIM_AUDIT_PASSWORD = process.env.claimAuditPassword || '';
        this.SALES_USER = process.env.salesUser || '';
        this.SALES_PASSWORD = process.env.salesPassword || '';
        this.RETENTION_AGENT_USER = process.env.retentionAgentUser || '';
        this.RETENTION_AGENT_PASSWORD = process.env.retentionAgentPassword || '';
        this.CUSTOMER_USER = process.env.customerUser || '';
        this.CUSTOMER_PASSWORD = process.env.customerPassword || '';
        this.FINANCE_USER = process.env.financeUser || '';
        this.FINANCE_PASSWORD = process.env.financePassword || '';
        this.CLAIMS_ADMIN_USER = process.env.claimsAdminUser || '';
        this.CLAIMS_ADMIN_PASSWORD = process.env.claimsAdminPassword || '';
        // Initialize Wombat user credentials
        this.WOMBAT_ADMIN_USER = process.env.userWombat || '';
        this.WOMBAT_ADMIN_PASSWORD = process.env.passwordWombat || '';
    }
    // Helper method to resolve environment-specific placeholders in URLs/hosts
    private resolveUrl(url: string, options: { useSqlVm?: boolean } = {}): string {
        let resolved = url;

        if (!resolved) {
            return resolved;
        }

        // Treat common VM environment names as VM-style environments where
        // {VM_NUMBER} placeholders should be replaced with the value from env.
        // Support: 'vm', 'vm-ca'
        const isVmEnv = ['vm', 'vm-ca'].includes(this.nodeEnv);
        if (isVmEnv && this.vmNumber && resolved.includes('{VM_NUMBER}')) {
            const vmNumberFormatted = options.useSqlVm ? this.vmNumber.substring(1) : this.vmNumber;
            resolved = resolved.replace(/{VM_NUMBER}/g, vmNumberFormatted);
        }

        if (this.nodeEnv === 'prod' && resolved.includes('{GREEN_BLUE}')) {
            // Handle "live" as empty string for production URLs without suffix
            const greenBlueValue = this.greenBlue === 'live' ? '' : this.greenBlue;
            resolved = resolved.replace(/{GREEN_BLUE}/g, greenBlueValue);
        }

        return resolved;
    }

    // Singleton pattern to get configuration instance
    static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}

export const config = Config.getInstance();