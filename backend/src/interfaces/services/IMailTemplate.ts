export interface IMailTemplate<T = unknown> {
  getSubject(): string;
  getText(data: T): string;
  getHtml(data: T): string;
}
