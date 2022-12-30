import puppeteer, { Browser, Page } from "puppeteer";

export default class Puppet {
  public browser!: Browser;
  public page!: Page;

  constructor() {
    this.init();
  }

  public async init(): Promise<void> {
    puppeteer
      .launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
      .then(async (browser) => {
        this.browser = browser;
        this.page = await browser.newPage();
      });
  }

  public async getMetaScreensot(id: string): Promise<Buffer | string> {
    await this.page.goto(`https://bin.gart.sh/api/${id}/clean`);
    // wait for the page to load
    return await this.page
      .screenshot({
        type: "webp",
        encoding: "binary",
        clip: {
          x: 23,
          y: 28,
          width: 550,
          height: 170,
        },
      })
  }
}
