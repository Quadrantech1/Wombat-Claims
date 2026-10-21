import { Page } from '@playwright/test';

export async function isMobile(page: Page): Promise<boolean> {
    const viewport = page.viewportSize();
    return viewport ? viewport.width <= 768 : false;
}