import { Label } from '@controls/label';
import { WelcomePage } from '../quote/welcome-page';

export class PpuWelcomePage extends WelcomePage {
    welcomeParagraph = new Label(this.page, "//*[@id='customercarecontact_tel']/..");
    beloweParagraph = new Label(this.page, "//p[@class='customer-portal-desc']");
  }